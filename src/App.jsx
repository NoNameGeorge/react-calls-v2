import axios from "axios";
import React from "react";

import Company from "./components/Company";
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";

function App() {
  // Если не задавать статически это значение - 
  // То я знаю, что с бэка можно передавать общее значение в header
  const pageSize = 10

  const [companies, setCompanies] = React.useState([])
  const [companiesPage, setCompaniesPage] = React.useState(1)
  const [isSearching, setIsSearching] = React.useState(false)

  // Для поиска можно было бы еще реализовать debounce
  const [searchValue, setSearchValue] = React.useState('')
  const [sortType, setSortType] = React.useState(null)

  const [hasNextPage, setHasNextPage] = React.useState(false)


  React.useEffect(() => {
    setIsSearching(prev => !prev)
    let params = ``

    params += searchValue ? `&filters=name@=${searchValue}` : ''
    params += sortType ? sortType : ''

    axios
      .get(`http://test.runcall.ru/Api/GetCallCampaigns?Page=${companiesPage}&PageSize=${pageSize}${params}`)
      .then(({ data }) => {
        setCompanies(data)
        // Проверка на наличие следующей страницы
        axios
          .get(`http://test.runcall.ru/Api/GetCallCampaigns?Page=${companiesPage + 1}&PageSize=${pageSize}${params}`)
          .then(({ data }) => {
            setHasNextPage(data.length !== 0)
          })
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsSearching(prev => !prev)
      })
  }, [companiesPage, searchValue, sortType])

  const pageHandler = (newPage = 1) => {
    setCompaniesPage(newPage)
  }

  return (
    <div className="main-wrapper">
      <div className="container main">
        <div className="company-title">Компании</div>
        <Filters
          value={searchValue}
          onChange={setSearchValue}
          sortHandler={setSortType}
          sortType={sortType}
        />
        {isSearching
          ? <div className='download'>Загрузка...</div>
          : companies.length
            ? <div className="company">
              {
                companies.map(company => {
                  return <Company
                    key={company.id}
                    {...company}
                  />
                })
              }
            </div>
            : <div className='not-found'>Нет результатов</div>
        }
        <Pagination
          className='company__pagination'
          currentPage={companiesPage}
          hasNextPage={hasNextPage}
          pageHandler={(newPage) => pageHandler(newPage)}
        />
      </div>
    </div>
  );
}

export default App;

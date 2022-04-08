import React from "react";
import axios from "axios";

import useDebounce from './../hooks/use-debounce';

import Filters from "./../components/Filters";
import Pagination from "./../components/Pagination";
import { useNavigate } from "react-router";

const Companies = () => {
    const navigate = useNavigate()
    const pageSize = 10

    const [companies, setCompanies] = React.useState([])
    const [companiesPage, setCompaniesPage] = React.useState(1)
    const [isSearching, setIsSearching] = React.useState(false)

    const [searchValue, setSearchValue] = React.useState('')
    const [sortType, setSortType] = React.useState(null)

    const [hasNextPage, setHasNextPage] = React.useState(false)

    const debouncedSearch = useDebounce(searchValue, 500)

    const setCompaniesFromAPI = (params) => {
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
    }

    React.useEffect(() => {
        setIsSearching(prev => !prev)
        let params = ``

        params += searchValue ? `&filters=name@=${searchValue}` : ''
        params += sortType ? sortType : ''

        setCompaniesFromAPI(params)
    }, [companiesPage, debouncedSearch, sortType])

    const pageResetOnTextHandler = (text) => {
        setCompaniesPage(1)
        setSearchValue(text)
    }

    const pageResetOnSortHandler = (type) => {
        setCompaniesPage(1)
        setSortType(type)
    }

    return (
        <div className="container main">
            <div className="company-title">Компании</div>
            <Filters
                text='Введите название компании'
                value={searchValue}
                onChange={(text) => pageResetOnTextHandler(text)}
                sortHandler={(type) => pageResetOnSortHandler(type)}
                sortType={sortType}
            />

            {isSearching && <div className='download'>Загрузка...</div>}
            {(!isSearching && !companies.length) && <div className='not-found'>Нет результатов</div>}

            {(!isSearching && companies.length) &&
                <div className="company">
                    {companies.map(company => {
                        return <div
                            key={company.id}
                            className="company__item "
                        >
                            <span onClick={() => navigate(`company/${company.id}`)}>
                                {company.name}
                            </span>
                        </div>
                    })}
                </div>
            }

            <Pagination
                className='company__pagination'
                currentPage={companiesPage}
                hasNextPage={hasNextPage}
                pageHandler={setCompaniesPage}
            />
        </div>
    )
};

export default Companies;
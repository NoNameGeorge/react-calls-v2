import axios from 'axios';
import React from 'react';
import { useParams } from 'react-router';
import useDebounce from '../hooks/use-debounce';

import Filters from '../components/Filters';
import Pagination from '../components/Pagination';

const Company = () => {
    const sortTypes = [{
        name: 'По умолчанию',
        type: null
    }, {
        name: 'Исходящие',
        type: 'isInbound==false'
    }, {
        name: 'Входящие',
        type: 'isInbound==true'
    }, {
        name: 'Есть запись',
        type: 'audioLink!=null'
    }, {
        name: 'Нет записи',
        type: 'audioLink==null'
    }]

    const { id } = useParams()
    const pageSize = 7

    const [calls, setCalls] = React.useState([])
    const [callsPage, setCallsPage] = React.useState(1)
    const [hasNextPage, setHasNextPage] = React.useState(false)
    const [companyName, setCompanyName] = React.useState('')
    const [searchValue, setSearchValue] = React.useState('')
    const [sortType, setSortType] = React.useState(null)
    const [isSearching, setIsSearching] = React.useState(false)

    const debouncedSearch = useDebounce(searchValue, 500)

    const setCallsFromAPI = (params) => {
        axios
            .get(`http://test.runcall.ru/Api/GetCallResults?Page=${callsPage}&PageSize=${pageSize}${params}`)
            .then(({ data }) => {
                setCalls(data)
                // Фильтр компаний по ID не получилось сделать, поэтому название возьму из звонков
                setCompanyName(data[0].callCampaign.name)

                axios
                    .get(`http://test.runcall.ru/Api/GetCallResults?Page=${callsPage + 1}&PageSize=${pageSize}${params}`)
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

        let params = `&filters=callCampaign.id==${id}`

        params += searchValue ? `,phone@=${searchValue}` : ''
        params += sortType ? `,${sortType}` : ''

        setCallsFromAPI(params)
    }, [callsPage, debouncedSearch, sortType])

    const pageResetOnTextHandler = (text) => {
        setCallsPage(1)
        setSearchValue(text)
    }

    const pageResetOnSortHandler = (type) => {
        setCallsPage(1)
        setSortType(type)
    }

    return (
        <div className='container main'>
            {companyName && <div className='company-title'>{companyName}</div>}

            <Filters
                text='Введите номер телефона'
                value={searchValue}
                onChange={(text) => pageResetOnTextHandler(text)}
                sortHandler={(type) => pageResetOnSortHandler(type)}
                sortType={sortType}
                sortTypes={sortTypes}
            />

            {isSearching && <div className='download'>Загрузка...</div>}
            {(!isSearching && !calls.length) && <div className='not-found'>Нет результатов</div>}
            {(!isSearching && calls.length) &&
                <div className='calls'>
                    {calls.map(call => {
                        console.log(call)
                        return <div
                            key={call.id}
                            className='calls__item '
                        >
                            <div className='calls__number'>{call.phone}</div>
                            <div className='calls__type'>{call.isInbound ? 'Входящий' : 'Исходящий'}</div>
                            <div className='calls__time'>
                                {call.duration
                                    ? <>
                                        {call.duration.days > 0 && `${call.duration.days} дня(-ей) `}
                                        {call.duration.hours > 0 && `${call.duration.hours} час(-ов, -а) `}
                                        {call.duration.minutes > 0 && `${call.duration.minutes} минут(-ы) `}
                                        {call.duration.seconds > 0 && `${call.duration.seconds} секунд(-ы)`}
                                    </>
                                    : 'Меньше секунды'
                                }

                            </div>
                            {call.audioLink
                                ? <a href={call.audioLink} className='calls__link'>Запись звонка</a>
                                : <div className='calls__link'>Записи нет</div>}

                            <div className='calls__date'>{call.dateCreated.slice(0, 10)}</div>

                            
                            <div className='calls__comment'>{call.comment}</div>
                        </div>
                    })}
                </div>
            }

            <Pagination
                className='company__pagination'
                currentPage={callsPage}
                hasNextPage={hasNextPage}
                pageHandler={setCallsPage}
            />
        </div>
    );
};

export default Company;
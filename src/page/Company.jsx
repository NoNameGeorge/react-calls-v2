import axios from 'axios';
import React from 'react';
import { useParams } from 'react-router';

const Company = () => {
    const { id } = useParams()

    const pageSize = 10

    const [active, setActive] = React.useState(false)
    const [calls, setCalls] = React.useState([])
    const [callsPage, setCallsPage] = React.useState(1)
    const [isSearching, setIsSearching] = React.useState(false)

    const [hasNextPage, setHasNextPage] = React.useState(false)

    console.log(id)


    const setCallsFromAPI = (params) => {
        axios
            .get(`http://test.runcall.ru/Api/GetCallResults?Page=${callsPage}&PageSize=${pageSize}${params}`)
            .then(response => {
                setCalls(response.data)
                // Проверка на наличие следующей страницы
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
        if (active) {
            setIsSearching(prev => !prev)

            let params = ``
            setCallsFromAPI(params)
        }
    }, [callsPage, active])

    return (
        <div className="container main">
            <div className="company-title">Звонки</div>

        </div>
    );
};

export default Company;
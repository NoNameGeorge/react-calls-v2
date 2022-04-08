import axios from 'axios';
import React from 'react';
import Pagination from './Pagination';

const Company = ({ id, name }) => {
    // Я либо не до конца разобрался с API
    // Либо у меня не получается :)
    // При запросах ?filters=name@="a" или ?filters=name@=a, или ?sorts=name
    // У меня выходит ошибка, поэтому я скопировал "БД" на json-server, чтобы подгружать данные с него
    const pageSize = 10

    const [active, setActive] = React.useState(false)
    const [calls, setCalls] = React.useState([])
    const [callsPage, setCallsPage] = React.useState(1)
    const [isSearching, setIsSearching] = React.useState(false)

    const [hasNextPage, setHasNextPage] = React.useState(false)



    const pageHandler = (newPage = 1) => {
        setCallsPage(newPage)
    }

    return (
        <div
            className={`company__item ${active ? 'active' : ''}`}
        >
            <span onClick={() => setActive(!active)}>
                {name}
            </span>
            {active ?
                (isSearching)
                    ? <div className='download'>Загрузка...</div>
                    : calls.length
                        ? <>
                            <div className="company__calls">
                                {calls.map(call => {
                                    return <div
                                        key={call.id}
                                        className='company__call'
                                    >
                                        <div className="call-number">{call.phone}</div>
                                        <div className="call-comment">{call.comment ? call.comment : '- Нет комментариев'}</div>
                                    </div>
                                })}
                            </div>
                            {hasNextPage && <Pagination
                                className='calls__pagination'
                                currentPage={callsPage}
                                hasNextPage={hasNextPage}
                                pageHandler={(newPage) => pageHandler(newPage)}
                            />}
                        </>
                        : <div className='not-found'>Нет звонков</div>
                : ''}
        </div>
    );
};

export default Company;
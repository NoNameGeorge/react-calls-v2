import React from 'react';

const Pagination = ({ className, currentPage, hasNextPage, pageHandler }) => {
    return (
        <>
            <div className={`${className} pagination`}>
                <span
                    className={`pagination__first ${currentPage <= 1 && 'disabled'}`}
                    onClick={() => pageHandler(1)}
                >
                    Первая страница
                </span>
                <span
                    className={`pagination__prev ${currentPage <= 1 && 'disabled'}`}
                    onClick={() => pageHandler(currentPage - 1)}
                >
                    Назад
                </span>
                <span
                    className={`pagination__next ${!hasNextPage && 'disabled'}`}
                    onClick={() => pageHandler(currentPage + 1)}
                >
                    Вперед
                </span>
            </div>
            <div className="current-page">Текущая страница: <span>{currentPage}</span></div>
        </>
    );
};

export default Pagination;
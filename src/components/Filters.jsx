import React from 'react';

const Filters = ({ text, value, onChange, sortHandler, sortType, sortTypes }) => {

    return (
        <div className="filters">
            <input
                type="text"
                className="filters__search"
                placeholder={text}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="filters__items">
                {sortTypes && sortTypes.map((sortItem, index) => {
                    return <div
                        key={`filter-item__${index}`}
                        className={`filters__item ${sortType === sortItem.type ? 'disabled' : ''}`}
                        onClick={() => sortHandler(sortItem.type)}
                    >
                        {sortItem.name}
                    </div>
                })}
            </div>
        </div>
    );
};

export default Filters;
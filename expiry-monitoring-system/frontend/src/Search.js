import React, { useState } from 'react';

const Search = ({ items }) => {
    const [filterName, setFilterName] = useState('');
    const [filterPrice, setFilterPrice] = useState('');
    const [filterQuantity, setFilterQuantity] = useState('');

    const filteredItems = items.filter(item => {
        return (
            (filterName ? item.name.includes(filterName) : true) &&
            (filterPrice ? item.price <= filterPrice : true) &&
            (filterQuantity ? item.quantity >= filterQuantity : true)
        );
    });

    return (
        <div>
            <h1>Search Items</h1>
            <input
                type="text"
                placeholder="Filter by name"
                value={filterName}
                onChange={e => setFilterName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Filter by price"
                value={filterPrice}
                onChange={e => setFilterPrice(e.target.value)}
            />
            <input
                type="number"
                placeholder="Filter by quantity"
                value={filterQuantity}
                onChange={e => setFilterQuantity(e.target.value)}
            />
            <ul>
                {filteredItems.map(item => (
                    <li key={item._id}>
                        {item.name} - {item.quantity} - ${item.price} - Expiry Date: {item.expiryDate}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Search;
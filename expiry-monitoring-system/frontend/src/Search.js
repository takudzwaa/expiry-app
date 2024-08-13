import React, { useState } from 'react';
import { Button, Box, Typography, Select, MenuItem } from '@mui/material';

const Search = ({ items }) => {
    const [filterName, setFilterName] = useState('');
    const [filterPrice, setFilterPrice] = useState('');
    const [filterQuantity, setFilterQuantity] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortCriteria, setSortCriteria] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const itemsPerPage = 10;

    const filteredItems = items.filter(item => {
        return (
            (filterName ? item.name.includes(filterName) : true) &&
            (filterPrice ? item.price <= filterPrice : true) &&
            (filterQuantity ? item.quantity >= filterQuantity : true)
        );
    });

    const sortedItems = filteredItems.sort((a, b) => {
        if (sortCriteria === 'name') {
            return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortCriteria === 'price') {
            return sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (sortCriteria === 'quantity') {
            return sortDirection === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity;
        } else if (sortCriteria === 'expiryDate') {
            return sortDirection === 'asc' ? new Date(a.expiryDate) - new Date(b.expiryDate) : new Date(b.expiryDate) - new Date(a.expiryDate);
        }
        return 0;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

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
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography>Sort by:</Typography>
                <Select value={sortCriteria} onChange={e => setSortCriteria(e.target.value)}>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="price">Price</MenuItem>
                    <MenuItem value="quantity">Quantity</MenuItem>
                    <MenuItem value="expiryDate">Expiry Date</MenuItem>
                </Select>
                <Select value={sortDirection} onChange={e => setSortDirection(e.target.value)}>
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                </Select>
            </Box>
            <ul>
                {currentItems.map(item => (
                    <li key={item._id}>
                        {item.name} - {item.quantity} - ${item.price} - Expiry Date: {item.expiryDate}
                    </li>
                ))}
            </ul>
            <Box display="flex" justifyContent="space-between">
                <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </Button>
                <Typography>Page {currentPage} of {totalPages}</Typography>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </Button>
            </Box>
        </div>
    );
};

export default Search;
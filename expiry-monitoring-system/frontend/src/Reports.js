import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('/api/v1/items');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    return (
        <div>
            <h1>Reports</h1>
            <ul>
                {items.map(item => (
                    <li key={item._id}>
                        {item.name} - {item.quantity} - ${item.price} - Expiry Date: {item.expiryDate}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reports;
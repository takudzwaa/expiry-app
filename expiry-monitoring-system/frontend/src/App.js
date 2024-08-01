import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [batchNo, setBatchNo] = useState('');
    const [price, setPrice] = useState('');
    const [updateQuantity, setUpdateQuantity] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/items')
            .then(response => {
                const sortedItems = response.data.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
                setItems(sortedItems);
            })
            .catch(error => console.error(error));
    }, []);

    const addItem = () => {
        axios.post('http://localhost:5000/items', { name, expiryDate, quantity, batchNo, price })
            .then(response => setItems([...items, response.data]))
            .catch(error => console.error(error));
    };

    const deleteItem = (id) => {
        axios.delete(`http://localhost:5000/items/${id}`)
            .then(() => setItems(items.filter(item => item._id !== id)))
            .catch(error => console.error(error));
    };

    const updateItemQuantity = (id) => {
        axios.put(`http://localhost:5000/items/${id}`, { quantity: updateQuantity })
            .then(response => {
                setItems(items.map(item => item._id === id ? response.data : item));
                setUpdateQuantity('');
            })
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h1>Expiry Date Monitoring System</h1>
            <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
            <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
            {/* ... */}
        </div>
    );
};

export default App;
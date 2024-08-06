import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Reports from './Reports'; // Import the Reports component

const App = () => {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [batchNo, setBatchNo] = useState('');
    const [price, setPrice] = useState('');
    const [updateQuantity, setUpdateQuantity] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterQuantity, setFilterQuantity] = useState('');
    const [filterPrice, setFilterPrice] = useState('');

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

    const filterItems = () => {
        return items.filter(item => 
            (filterName ? item.name.includes(filterName) : true) &&
            (filterQuantity ? item.quantity === parseInt(filterQuantity) : true) &&
            (filterPrice ? item.price === parseFloat(filterPrice) : true)
        );
    };

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/reports">Reports</Link></li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/" exact>
                        <h1>Expiry Date Monitoring System</h1>
                        <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} />
                        <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
                        <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
                        <input type="text" placeholder="Batch No" value={batchNo} onChange={e => setBatchNo(e.target.value)} />
                        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
                        <button onClick={addItem}>Add Item</button>

                        <h2>Filter Items</h2>
                        <input type="text" placeholder="Filter by Name" value={filterName} onChange={e => setFilterName(e.target.value)} />
                        <input type="number" placeholder="Filter by Quantity" value={filterQuantity} onChange={e => setFilterQuantity(e.target.value)} />
                        <input type="number" placeholder="Filter by Price" value={filterPrice} onChange={e => setFilterPrice(e.target.value)} />

                        <h2>Items</h2>
                        <ul>
                            {filterItems().map(item => (
                                <li key={item._id}>
                                    {item.name} - {item.quantity} - ${item.price}
                                    <button onClick={() => deleteItem(item._id)}>Delete</button>
                                    <input type="number" placeholder="Update Quantity" value={updateQuantity} onChange={e => setUpdateQuantity(e.target.value)} />
                                    <button onClick={() => updateItemQuantity(item._id)}>Update Quantity</button>
                                </li>
                            ))}
                        </ul>
                    </Route>
                    <Route path="/reports">
                        <Reports items={items} />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
};

export default App;
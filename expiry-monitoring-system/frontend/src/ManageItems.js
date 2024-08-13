import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Container, Paper, TextField,
    Button, List, ListItem, ListItemText, IconButton, Box, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';
import Reports from './Reports';
import Home from './Home';
import Search from './Search';
import ManageItems from './ManageItems';

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
            .then(response => {
                setItems([...items, response.data]);
                // Reset form fields
                setName('');
                setExpiryDate('');
                setQuantity('');
                setBatchNo('');
                setPrice('');
            })
            .catch(error => console.error(error));
    };

    const deleteItem = (id) => {
        axios.delete(`http://localhost:5000/items/${id}`)
            .then(() => {
                setItems(items.filter(item => item._id !== id));
            })
            .catch(error => console.error(error));
    };

    const updateItemQuantity = (id, quantity) => {
        axios.put(`http://localhost:5000/items/${id}`, { quantity })
            .then(response => {
                setItems(items.map(item => item._id === id ? { ...item, quantity: response.data.quantity } : item));
            })
            .catch(error => console.error(error));
    };

    const itemsInStock = items.filter(item => item.quantity > 0);

    return (
        <Router>
            <Container>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            Expiry Monitoring System
                        </Typography>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/search">Search</Button>
                        <Button color="inherit" component={Link} to="/manage">Manage Items</Button>
                        <Button color="inherit" component={Link} to="/reports">Reports</Button>
                    </Toolbar>
                </AppBar>
                <Routes>
                    <Route path="/" element={<Home items={itemsInStock} />} />
                    <Route path="/search" element={<Search items={items} />} />
                    <Route path="/manage" element={<ManageItems items={items} setItems={setItems} />} />
                    <Route path="/reports" element={<Reports items={items} />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
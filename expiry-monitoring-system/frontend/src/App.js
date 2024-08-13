import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Reports from './Reports'; // Import the Reports component
import {
    AppBar, Toolbar, Typography, Container, Paper, TextField,
    Button, List, ListItem, ListItemText, IconButton, Box, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';

//Default Authorization header
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;

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
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Expiry Date Monitoring System
                    </Typography>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/reports">Reports</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h4" gutterBottom>Manage Items</Typography>
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField label="Item Name" value={name} onChange={e => setName(e.target.value)} />
                                <TextField type="date" label="Expiry Date" InputLabelProps={{ shrink: true }} value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
                                <TextField type="number" label="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
                                <TextField label="Batch No" value={batchNo} onChange={e => setBatchNo(e.target.value)} />
                                <TextField type="number" label="Price" value={price} onChange={e => setPrice(e.target.value)} />
                                <Button variant="contained" startIcon={<AddIcon />} onClick={addItem}>Add Item</Button>
                            </Box>

                            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Filter Items</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField label="Filter by Name" value={filterName} onChange={e => setFilterName(e.target.value)} />
                                <TextField type="number" label="Filter by Quantity" value={filterQuantity} onChange={e => setFilterQuantity(e.target.value)} />
                                <TextField type="number" label="Filter by Price" value={filterPrice} onChange={e => setFilterPrice(e.target.value)} />
                            </Box>

                            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Items</Typography>
                            <List>
                                {filterItems().map(item => (
                                    <ListItem key={item._id} divider>
                                        <ListItemText
                                            primary={`${item.name} - ${item.quantity} - $${item.price} - Expiry Date: ${item.expiryDate}`}
                                        />
                                        <TextField type="number" placeholder="Update Quantity" value={updateQuantity} onChange={e => setUpdateQuantity(e.target.value)} sx={{ width: '100px' }} />
                                        <IconButton color="primary" onClick={() => updateItemQuantity(item._id)}>
                                            <UpdateIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => deleteItem(item._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    } />
                    <Route path="/reports" element={<Reports items={items} />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;

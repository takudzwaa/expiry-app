import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Paper, Box, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Reports from './Reports';

const App = () => {
    const [name, setName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [quantity, setQuantity] = useState('');
    const [batchNo, setBatchNo] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [receivedOn, setReceivedOn] = useState('');
    const [items, setItems] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [filterQuantity, setFilterQuantity] = useState('');
    const [filterPrice, setFilterPrice] = useState('');
    const [updateQuantity, setUpdateQuantity] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/items');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const addItem = async () => {
        try {
            const newItem = { batchNo, name, quantity, expiryDate, price, category, receivedOn };
            const response = await axios.post('http://localhost:5000/items', newItem);
            setItems([...items, response.data]);
            // Clear form fields
            setBatchNo('');
            setName('');
            setQuantity('');
            setExpiryDate('');
            setPrice('');
            setCategory('');
            setReceivedOn('');
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const updateItemQuantity = async (id) => {
        try {
            const updatedItem = items.find(item => item._id === id);
            updatedItem.quantity = updateQuantity;
            const response = await axios.put(`http://localhost:5000/items/${id}`, updatedItem);
            setItems(items.map(item => (item._id === id ? response.data : item)));
            setUpdateQuantity('');
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/items/${id}`);
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const filterItems = () => {
        return items.filter(item => 
            item.name.includes(filterName) &&
            (filterQuantity === '' || item.quantity === Number(filterQuantity)) &&
            (filterPrice === '' || item.price === Number(filterPrice))
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
                                <TextField label="Batch No" value={batchNo} onChange={e => setBatchNo(e.target.value)} />
                                <TextField label="Item Name" value={name} onChange={e => setName(e.target.value)} />
                                <TextField type="number" label="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
                                <TextField type="date" label="Expiry Date" InputLabelProps={{ shrink: true }} value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
                                <TextField type="number" label="Price" value={price} onChange={e => setPrice(e.target.value)} />
                                <TextField label="Category" value={category} onChange={e => setCategory(e.target.value)} />
                                <TextField type="date" label="Received On" InputLabelProps={{ shrink: true }} value={receivedOn} onChange={e => setReceivedOn(e.target.value)} />
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
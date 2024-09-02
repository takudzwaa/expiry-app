import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Paper, Box, TextField, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import Reports from './Reports';

const App = () => {
    const [items, setItems] = useState([]);
    const [filterName, setFilterName] = useState('');
    const [filterQuantity, setFilterQuantity] = useState('');
    const [filterPrice, setFilterPrice] = useState('');

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
                    <Button color="inherit" component={Link} to="/manage">Manage</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={
                        <Paper sx={{ p: 2 }}>

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
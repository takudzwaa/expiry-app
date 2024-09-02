// expiry-monitoring-system/frontend/src/Manage.js
import React, { useState } from 'react';
import { Typography, Box, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Manage = () => {
  const [batchNo, setBatchNo] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [receivedOn, setReceivedOn] = useState('');

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

  return (
    <>
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
    </>
  );
};

export default Manage;
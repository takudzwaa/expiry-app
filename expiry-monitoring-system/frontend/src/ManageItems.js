import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, TextField, List, ListItem, ListItemText, IconButton, TablePagination } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const ManageItems = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', description: '', quantity: 0, expiryDate: '', price: 0 });
    const [editingItem, setEditingItem] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const fetchItems = useCallback(async () => {
        try {
            const response = await axios.get(`/api/v1/items?page=${page + 1}&limit=${rowsPerPage}`);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }, [page, rowsPerPage]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const addItem = async () => {
        try {
            if (editingItem) {
                const response = await axios.put(`/api/v1/items/${editingItem._id}`, newItem);
                setItems(items.map(item => item._id === editingItem._id ? response.data : item));
                setEditingItem(null);
            } else {
                const response = await axios.post('/api/v1/items', newItem);
                setItems([...items, response.data]);
            }
            setNewItem({ name: '', description: '', quantity: 0, expiryDate: '', price: 0 });
        } catch (error) {
            console.error('Error adding/updating item:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`/api/v1/items/${id}`);
            setItems(items.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const editItem = (item) => {
        setNewItem(item);
        setEditingItem(item);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <h1>Manage Items</h1>
            <div>
                <TextField name="name" label="Name" value={newItem.name} onChange={handleInputChange} />
                <TextField name="description" label="Description" value={newItem.description} onChange={handleInputChange} />
                <TextField name="quantity" label="Quantity" type="number" value={newItem.quantity} onChange={handleInputChange} />
                <TextField name="expiryDate" label="Expiry Date" type="date" value={newItem.expiryDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
                <TextField name="price" label="Price" type="number" value={newItem.price} onChange={handleInputChange} />
                <Button onClick={addItem}>{editingItem ? 'Update Item' : 'Add Item'}</Button>
            </div>
            <List>
                {items.map((item) => (
                    <ListItem key={item._id}>
                        <ListItemText
                            primary={item.name}
                            secondary={`Quantity: ${item.quantity}, Expiry Date: ${item.expiryDate}, Price: ${item.price}`}
                        />
                        <IconButton edge="end" aria-label="edit" onClick={() => editItem(item)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item._id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
            <TablePagination
                component="div"
                count={items.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default ManageItems;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config(); // Ensure this line is present and at the top

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MongoDB connection string is missing in .env file');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  const itemSchema = new mongoose.Schema({
    batchNo: { type: String, unique: true },
    name: String,
    quantity: Number,
    expiryDate: Date,
    price: Number,
    category: String, 
    receivedOn: Date,
    

  });

const Item = mongoose.model('Item', itemSchema);

app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/items', async (req, res) => {
  const { batchNo, name, quantity, expiryDate, price, category, receivedOn } = req.body;
  const newItem = new Item({ batchNo, name, quantity, expiryDate, price, category, receivedOn });
  try {
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save item' });
  }
});

  app.put('/items/:id', async (req, res) => {
    const { batchNo, name, quantity, expiryDate, price, category, receivedOn } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { batchNo, name, quantity, expiryDate, price, category, receivedOn },
      { new: true }
    );
    res.json(updatedItem);
  });
  
  app.delete('/items/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  });

  app.listen(5000, () => console.log('Server running on port 5000'));
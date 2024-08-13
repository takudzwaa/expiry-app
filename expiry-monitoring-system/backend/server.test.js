const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const app = require('./server'); // Adjust the path if necessary

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI;
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
  await new Promise(resolve => setTimeout(() => resolve(), 500)); // Add a delay to ensure all connections are closed
});

describe('Items API', () => {
  it('should get all items', async () => {
    const res = await request(app).get('/api/v1/items');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new item', async () => {
    const res = await request(app)
      .post('/api/v1/items')
      .send({
        name: 'Item1',
        description: 'Description1',
        quantity: 10,
        expiryDate: '2023-12-31',
        price: 100
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
  });

  it('should update an item', async () => {
    const newItem = await request(app)
      .post('/api/v1/items')
      .send({
        name: 'Item2',
        description: 'Description2',
        quantity: 20,
        expiryDate: '2023-12-31',
        price: 200
      });
    const res = await request(app)
      .put(`/api/v1/items/${newItem.body._id}`)
      .send({
        name: 'Updated Item2',
        description: 'Updated Description2',
        quantity: 30,
        expiryDate: '2024-12-31',
        price: 300
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Updated Item2');
  });

  it('should delete an item', async () => {
    const newItem = await request(app)
      .post('/api/v1/items')
      .send({
        name: 'Item3',
        description: 'Description3',
        quantity: 30,
        expiryDate: '2023-12-31',
        price: 300
      });
    const res = await request(app).delete(`/api/v1/items/${newItem.body._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Item deleted');
  });
});
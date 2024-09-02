import React from 'react';

const Reports = ({ items }) => {
    return (
        <div>
            <h1>Reports</h1>
            <ul>
                {items.map(item => (
                    <li key={item._id}>
                        <strong>Name:</strong> {item.name} <br />
                        <strong>Quantity:</strong> {item.quantity} <br />
                        <strong>Price:</strong> ${item.price} <br />
                        <strong>Expiry Date:</strong> {item.expiryDate} <br />
                        <strong>Category:</strong> {item.category} <br />
                        <strong>Received On:</strong> {item.receivedOn} <br />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reports;
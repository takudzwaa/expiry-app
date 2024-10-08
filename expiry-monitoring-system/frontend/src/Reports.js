import React from 'react';

const Reports = ({ items }) => {
    return (
        <div>
            <h1>Reports</h1>
            <ul>
                {items.map(item => (
                    <li key={item._id}>
                        {item.name} - {item.quantity} - ${item.price} - Expiry Date: {item.expiryDate}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reports;
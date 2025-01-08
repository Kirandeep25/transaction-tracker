import React, { useState } from 'react';
import axios from 'axios';

const AddExpense = () => {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [comments, setComments] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from local storage
            const response = await axios.post('http://localhost:8000/api/expenses', 
                { category, amount, comments },
                { headers: { Authorization: `Bearer ${token}` } } // Include the token in the headers
            );
            if (response.status === 201) {
                // Handle successful expense addition (e.g., reset form, show success message)
                setCategory('');
                setAmount('');
                setComments('');
                setSuccessMessage('Expense added successfully!'); // Set success message
            }
        } catch (error) {
            console.error('Failed to add expense:', error);
        }
    };

    return (
        <div className="container">
            {successMessage && <div className="alert alert-success">{successMessage}</div>} {/* Display success message */}
            <form onSubmit={handleSubmit}>
                <h2 className="mt-4">Add Expense</h2>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                </div>
                <div className="form-group">
                    <input type="number" className="form-control" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
                <div className="form-group">
                    <textarea className="form-control" placeholder="Comments" value={comments} onChange={(e) => setComments(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Add Expense</button>
            </form>
        </div>
    );
};

export default AddExpense;

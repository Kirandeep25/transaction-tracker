import React, { useState } from 'react';
import axios from 'axios';

const AddExpense = () => {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [comments, setComments] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); 
            const response = await axios.post('http://localhost:8000/api/expenses', 
                { category, amount, comments },
                { headers: { Authorization: `Bearer ${token}` } } 
            );
            if (response.status === 201) {
                setCategory('');
                setAmount('');
                setComments('');
                setSuccessMessage('Expense added successfully!'); 
            }
        } catch (error) {
            console.error('Failed to add expense:', error);
        }
    };

    return (
        <div className="container">
            {successMessage && <div className="alert alert-success">{successMessage}</div>} {}
             <form onSubmit={handleSubmit} className="p-4 bg-light border rounded shadow">
            <h2 className="mb-4 text-start">Add Expense</h2>
            <div className="row mb-3">
                <label htmlFor="category" className="form-label text-start">Category</label>
                <input type="text" id="category" className="form-control" placeholder="Enter category" value={category} onChange={(e) => setCategory(e.target.value)} required/>
            </div>
            <div className="row mb-3">
                <label htmlFor="amount" className="form-label text-start">Amount</label>
                <input type="number" id="amount" className="form-control" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)}required/>
            </div>
            <div className="row mb-3">
                <label htmlFor="comments" className="form-label text-start">Comments</label>
                <textarea id="comments" className="form-control"rows="3" placeholder="Enter comments" value={comments} onChange={(e) => setComments(e.target.value)}></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">Add Expense</button>
        </form>
        </div>
    );
};

export default AddExpense;

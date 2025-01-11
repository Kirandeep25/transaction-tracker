import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const EditExpense = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const { expense } = location.state || {}; 
    //const onUpdate = location.state?.onUpdate; 
    const [category, setCategory] = useState(expense?.category || '');
    const [amount, setAmount] = useState(expense?.amount || 0);
    const [comments, setComments] = useState(expense?.comments || '');

    if (!expense) {
        console.error('Expense data is not available');
        return <div>Error: Expense data is not available.</div>; 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:8000/api/expenses/${expense._id}`,
                { category, amount, comments },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            //onUpdate({ ...expense, category, amount, comments });
            alert('Expense updated successfully!'); 
            navigate('/expense-list'); 
        } catch (error) {
            console.error('Failed to update expense:', error);
        }
    };

    return (
    <form onSubmit={handleSubmit} className="form-container container mt-4 p-4 border rounded bg-light shadow">
    <div className="mb-3 text-start">
        <label className="form-label ">Category:</label>
        <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
        />
    </div>
    <div className="mb-3 text-start">
        <label className="form-label">Amount:</label>
        <input
            type="number"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
        />
    </div>
    <div className="mb-3 text-start">
        <label className="form-label">Comments:</label>
        <input
            type="text"
            className="form-control"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
        />
    </div>
    <button type="submit" className="btn btn-success w-100">Update Expense</button>
    </form>
    );
};

export default EditExpense;

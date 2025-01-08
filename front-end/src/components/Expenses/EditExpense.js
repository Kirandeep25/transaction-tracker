import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const EditExpense = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize navigate
    const { expense } = location.state || {}; // Access expense from location state
    //const onUpdate = location.state?.onUpdate; // Access onUpdate from location state
    const [category, setCategory] = useState(expense?.category || '');
    const [amount, setAmount] = useState(expense?.amount || 0);
    const [comments, setComments] = useState(expense?.comments || '');

    if (!expense) {
        console.error('Expense data is not available');
        return <div>Error: Expense data is not available.</div>; // Handle undefined expense
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
            alert('Expense updated successfully!'); // Show success message
            navigate('/expense-list'); // Navigate back to the expense list after updating
        } catch (error) {
            console.error('Failed to update expense:', error);
        }
    };

    return (
<form onSubmit={handleSubmit} className="form-container">
            <div>
                <label>Category:</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div>
                <label>Amount:</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
                <label>Comments:</label>
                <input type="text" value={comments} onChange={(e) => setComments(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-success">
                Update Expense
            </button>
        </form>
    );
};

export default EditExpense;

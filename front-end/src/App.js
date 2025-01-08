import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import AddExpense from './components/Expenses/AddExpense';
import ExpenseList from './components/Expenses/ExpenseList';
import EditExpense from './components/Expenses/EditExpense';
import ExpenseChart from './components/Visualization/ExpenseChart';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
    const [expenses, setExpenses] = useState([]); // State to manage expenses

    const onLogin = (username) => {
        localStorage.setItem('username', username); // Store the username in local storage
        setExpenses([]); // Clear expenses on login
    };

    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login onLogin={onLogin} />} /> {/* Pass onLogin to Login */}
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/add-expense" element={<AddExpense />} />
                    <Route path="/expense-list" element={<ExpenseList />} />
                    <Route path="/edit-expense" element={<EditExpense />} />
                    <Route path="/chart" element={<ExpenseChart expenses={expenses} />} /> {/* Pass expenses to ExpenseChart */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
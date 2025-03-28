import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import AddExpense from './components/Expenses/AddExpense';
import ExpenseList from './components/Expenses/ExpenseList';
import EditExpense from './components/Expenses/EditExpense';
import ExpenseChart from './components/Visualization/ExpenseChart';
import Navbar from './components/Navbar';
import BudgetAlert from './components/Expenses/BudgetAlert';
import './App.css';

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [budgetLimit, setBudgetLimit] = useState(
        localStorage.getItem("budgetLimit") ? Number(localStorage.getItem("budgetLimit")) : 10000
    );
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        setTotalSpent(total);
    }, [expenses]);
    
    // Function to update budget and save in localStorage
    const updateBudget = (newBudget) => {
        setBudgetLimit(newBudget);
        localStorage.setItem("budgetLimit", newBudget);
    };
    const onLogin = (username) => {
        localStorage.setItem('username', username);
        setExpenses([]); // Reset expenses on login
    };
    
    useEffect(() => {
        const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
        setExpenses(storedExpenses);
    }, []);
    
    useEffect(() => {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }, [expenses]);
    
    return (
        <Router>
            <div className="App">
                <Navbar totalSpent={totalSpent} budgetLimit={budgetLimit} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login onLogin={onLogin} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/add-expense" element={<AddExpense setExpenses={setExpenses} />} />
                    <Route path="/expense-list" element={<ExpenseList expenses={expenses} setExpenses={setExpenses} />} />
                    <Route path="/edit-expense/:id" element={<EditExpense setExpenses={setExpenses} />} />
                    <Route path="/chart" element={<ExpenseChart expenses={expenses} />} />
                    <Route path="/budget-alert" element={<BudgetAlert updateBudget={updateBudget}/>} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;


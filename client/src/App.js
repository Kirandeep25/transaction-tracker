import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [editExpenseId, setEditExpenseId] = useState(null);

  // Fetch expenses from the backend on mount
  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/expenses");
      setExpenses(response.data.data);  // Assuming response contains a 'data' field
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses(); // Fetch the expenses on mount
  }, []);

  // Function to add a new expense via POST request to the backend
  const addExpense = async (expense) => {
    try {
      const response = await axios.post("http://localhost:5000/api/expenses/add", expense);
      // Directly update the expenses list with the response data (the new expense)
      setExpenses((prevExpenses) => [...prevExpenses, response.data.data]);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // Function to delete an expense via DELETE request to the backend
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));  // Remove the deleted expense from state
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Function to set the expense in edit mode (optional for future feature)
  const editExpense = (expense) => {
    setEditExpenseId(expense._id);
    // Optionally pass the expense to the ExpenseForm for editing
  };

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <ExpenseForm
        addExpense={addExpense}
        editExpenseId={editExpenseId}
        setEditExpenseId={setEditExpenseId}
        fetchExpenses={fetchExpenses}  // Pass the fetchExpenses function to ExpenseForm
      />
      <ExpenseList
        expenses={expenses}
        deleteExpense={deleteExpense}
        editExpense={editExpense}
      />
    </div>
  );
};

export default App;





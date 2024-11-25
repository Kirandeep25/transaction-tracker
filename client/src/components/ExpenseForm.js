// src/components/ExpenseForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
const ExpenseForm = ({ addExpense, editExpenseId, setEditExpenseId, fetchExpenses }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // Populate the form fields if we are editing an expense
  useEffect(() => {
    if (editExpenseId) {
      // Fetch the expense details from the backend to populate the form
      const fetchExpense = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/expenses/${editExpenseId}`);
          const expense = response.data.data;
          setAmount(expense.amount);
          setCategory(expense.category);
          setDescription(expense.description);
          setDate(expense.date);
        } catch (error) {
          console.error("Error fetching expense for edit:", error);
        }
      };
      fetchExpense();
    }
  }, [editExpenseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); 
    const newExpense = {
      amount,
      category,
      description,
      date,
    };

    try {
      if (editExpenseId) {
        // If we are editing, send a PUT request to update the expense
        const response = await axios.put(`http://localhost:5000/api/expenses/${editExpenseId}`, newExpense);
        console.log('Expense updated:', response.data);

        // Update the list of expenses in the parent (optional)
        fetchExpenses();

        // Reset edit mode
        setEditExpenseId(null);
      } else {
        // If we are adding, send a POST request to add the new expense
        const response = await axios.post("http://localhost:5000/api/expenses/add", newExpense);
        console.log('Expense added:', response.data);

        // Check if the response data contains the newly added expense
        if (response && response.data && response.data.data) {
          // Add the new expense to the UI
          addExpense(response.data.data);  // Make sure it's the correct property (e.g., `data` contains the expense)
        } else {
          console.log("Error: No data returned for the added expense.");
        }

        // Optionally, fetch the updated expense list
        fetchExpenses();
      }

      // Clear the form fields after submitting
      setAmount("");
      setCategory("");
      setDescription("");
      setDate("");
    } catch (error) {
      console.error("Error adding/updating expense:", error);
    }
};


  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        p: 4,
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        {editExpenseId ? "Edit Expense" : "Add Expense"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {editExpenseId ? "Update Expense" : "Add Expense"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ExpenseForm;


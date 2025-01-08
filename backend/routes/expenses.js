const express = require('express');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply middleware to all routes
router.use(authMiddleware);

// Add Expense
router.post('/', async (req, res) => {
    const { category, amount, comments } = req.body;
    try {
        const newExpense = new Expense({ 
            category, 
            amount, 
            comments,
            user: req.user._id // Link the expense to the logged-in user
        });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Failed to add expense", error: error.message });
    }
});

// View Expenses (only for the logged-in user)
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ createdAt: -1 }); // Filter by user ID
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch expenses", error: error.message });
    }
});

// Edit Expense
router.put('/:id', async (req, res) => {
    const { category, amount, comments } = req.body;
    try {
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id }, // Ensure the user can only update their own expense
            { category, amount, comments, updatedAt: Date.now() },
            { new: true }
        );
        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: "Failed to update expense", error: error.message });
    }
});

// Delete Expense
router.delete('/:id', async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id }); // Ensure the user can only delete their own expense
        if (!expense) {
            return res.status(404).json({ message: "Expense not found or not authorized" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Failed to delete expense", error: error.message });
    }
});

module.exports = router;

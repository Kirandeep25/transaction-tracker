const mongoose = require("mongoose");
const express = require("express");
const router = express.Router(); // To define routes

// Define the Expense Schema
const ExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true, // User must provide this
  },
  amount: {
    type: Number,
    required: true, // Expense amount is mandatory
  },
  date: {
    type: Date,
    default: Date.now, // Defaults to current date if not provided
  },
  category: {
    type: String,
    required: true, // e.g., "Food", "Travel", "Shopping"
  },
});

// Create and export the model using the schema
const Expense = mongoose.model("Expense", ExpenseSchema);

// Test route (to check if the server is working)
router.get("/test", (req, res) => {
  res.status(200).send("Test route is working!");
});

// POST route to add a new expense
router.post("/add", async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    // Validation for required fields
    if (!description || !amount || !category) {
      return res.status(400).json({ error: "All fields (description, amount, category) are required." });
    }

    // Additional validation checks
    if (typeof description !== "string" || typeof category !== "string") {
      return res.status(400).json({ error: "Description and category must be strings." });
    }

    // Description length validation (e.g., max 500 characters)
    if (description.length > 500) {
      return res.status(400).json({ error: "Description must be less than 500 characters." });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Amount must be a valid positive number." });
    }

    // Date validation
    let parsedDate;
    if (date) {
      parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format." });
      }
    } else {
      parsedDate = new Date(); // Use current date if not provided
    }

    // Create a new expense object
    const newExpense = new Expense({
      description,
      amount,
      category,
      date: parsedDate,
    });

    // Save the expense in the database
    const savedExpense = await newExpense.save();

    res.status(201).json({ message: "Expense added successfully!", data: savedExpense });

  } catch (error) {
    console.error("Error while adding expense:", error);  // Logging error
    res.status(500).json({ error: "An unexpected error occurred while adding the expense." });
  }
});

// GET route to fetch all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();

    // Handle case when there are no expenses in the database
    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found." });
    }

    res.status(200).json({
      message: "Expenses retrieved successfully!",
      data: expenses,
    });
  } catch (error) {
    console.error("Error while fetching expenses:", error);  // Logging error
    res.status(500).json({ error: "An unexpected error occurred while retrieving expenses." });
  }
});

// GET route to fetch a specific expense by its ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get expense ID from the URL

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid expense ID." });
    }

    const expense = await Expense.findById(id);

    // Handle case when expense is not found
    if (!expense) {
      return res.status(404).json({ message: "Expense not found." });
    }

    res.status(200).json({
      message: "Expense retrieved successfully!",
      data: expense,
    });
  } catch (error) {
    console.error("Error while retrieving expense:", error);  // Logging error
    res.status(500).json({ error: "An unexpected error occurred while retrieving the expense." });
  }
});

// DELETE route to remove an expense by its ID
router.delete("/:id", async (req, res) => {
  console.log("DELETE request received for ID:", req.params.id); // Debugging log

  try {
    const { id } = req.params;

    // Handle case where ID is not provided
    if (!id) {
      return res.status(400).json({ error: "Expense ID is required for deletion." });
    }

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid expense ID." });
    }

    const deletedExpense = await Expense.findByIdAndDelete(id);

    // Handle case when the expense is not found
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found or already deleted." });
    }

    res.status(200).json({
      message: "Expense deleted successfully!",
      data: deletedExpense,
    });
  } catch (error) {
    console.error("Error while deleting expense:", error);  // Logging error
    res.status(500).json({ error: "An unexpected error occurred while deleting the expense." });
  }
});

// routes/expenses.js
router.put("/:id", async (req, res) => {
    const { amount, category, description, date } = req.body;
  
    try {
      const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        { amount, category, description, date },
        { new: true }
      );
  
      if (!updatedExpense) {
        return res.status(404).json({ message: "Expense not found" });
      }
  
      res.status(200).json(updatedExpense);
    } catch (error) {
      console.error("Error updating expense", error);
      res.status(500).json({ message: "Failed to update expense" });
    }
  });
  
// Global error handler middleware
router.use((err, req, res, next) => {
  console.error(err); // Log the error to console
  res.status(500).json({ error: "Internal server error" }); // Send generic error message
});

// Export the router
module.exports = router;

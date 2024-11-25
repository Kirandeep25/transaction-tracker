const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const expenseRoutes = require("./models/expenses"); // Import routes from expenses.js

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json({limit: '10mb'})); // Parse incoming JSON requests

// MongoDB connection string
const uri = "mongodb+srv://kaurkirandeep51797:c0joeP4gtWEBXNlU@cluster0.niqqk.mongodb.net/transaction-tracker?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api/expenses", expenseRoutes); // Set up routes for expenses

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


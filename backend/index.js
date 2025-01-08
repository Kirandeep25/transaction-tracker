const express = require('express');
const cors = require('cors'); // Import CORS
const { db } = require('./db/db');

const app = express(); // Initialize the app
app.use(cors()); // Enable CORS for all routes
const expensesRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json()); 

// Connect to the database
db();

// Define routes
app.use('/api/expenses', expensesRoutes);
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

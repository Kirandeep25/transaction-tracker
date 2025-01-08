const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');

const app = express(); 
app.use(cors()); 
const expensesRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();
app.use(express.json()); 

db();

app.use('/api/expenses', expensesRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

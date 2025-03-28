const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');  
const morgan = require('morgan');  
const rateLimit = require('express-rate-limit'); 
const { db } = require('./db/db');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();
const app = express(); 

db();

app.use(cors());
app.use(express.json());
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logs API requests

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

const redis = require('redis');

const client = redis.createClient({
    socket: {
        reconnectStrategy: (retries) => {
            console.log(`Retrying Redis connection (${retries})...`);
            return retries < 5 ? 5000 : false; // Retry up to 5 times, every 5 sec
        }
    }
});

client.on('connect', () => console.log('Redis Connected'));
client.on('error', (err) => console.error('Redis Error:', err));

client.connect();


const expensesRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth');
app.use('/api/expenses', expensesRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


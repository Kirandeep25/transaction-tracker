const express = require('express');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/authMiddleware');
const redis = require('redis');
const { Parser } = require("json2csv");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const router = express.Router();

router.use(authMiddleware);

const client = redis.createClient({
    host: process.env.REDIS_HOST,    
    port: process.env.REDIS_PORT,
});
client.connect().catch(err => console.error('Redis Connection Failed:', err));

async function cacheMiddleware(req, res, next) {
    try {
        const cachedData = await client.get(`expenses:${req.user._id}`);
        if (cachedData) {
            console.log('🔹 Serving from Redis Cache');
            return res.status(200).json(JSON.parse(cachedData));
        }
        next();
    } catch (error) {
        console.error('Redis Error:', error);
        next();
    }
}

async function clearCache(userId) {
    await client.del(`expenses:${userId}`);
}

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
        await clearCache(req.user._id);
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Failed to add expense", error: error.message });
    }
});

router.get("/filter", async (req, res) => {
    try {
        const { category, minAmount, maxAmount, startDate, endDate, sortBy, sortOrder } = req.query;

        let filter = { user: req.user._id };

        if (category) {
            filter.category = new RegExp(`^${category}$`, "i"); // Case-insensitive search
        }

        if (minAmount || maxAmount) filter.amount = {};
        if (minAmount) filter.amount.$gte = parseFloat(minAmount);
        if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);

        if (startDate || endDate) filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);

        const sortOptions = sortBy ? { [sortBy]: sortOrder === "asc" ? 1 : -1 } : { createdAt: -1 };

        const expenses = await Expense.find(filter).sort(sortOptions);
        
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Error filtering expenses", error });
    }
});

router.get("/budget-alert", async (req, res) => {
    try {
        const { budget } = req.query; // Get budget directly from the user
        if (!budget) return res.status(400).json({ message: "Budget is required" });

        const totalSpent = await Expense.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: null, totalSpent: { $sum: "$amount" } } }
        ]);

        const spentAmount = totalSpent[0]?.totalSpent || 0; // Handle case where no expenses exist
        const remainingBudget = budget - spentAmount;

        const alert = spentAmount > budget
            ? `Budget Exceeded by ₹${spentAmount - budget}!`
            : `You have ₹${remainingBudget} remaining in your budget.`;

        res.json({ spentAmount, remainingBudget, alert });
    } catch (error) {
        res.status(500).json({ message: "Error checking budget", error });
    }
});



  router.get("/export/csv", async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).lean();
        
        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found to export" });
        }

        const fields = ["category", "amount", "comments", "createdAt"];
        const opts = { fields, dateFormat: "YYYY-MM-DD HH:mm:ss" };
        const parser = new Parser(opts);
        const csv = parser.parse(expenses);

        res.setHeader("Content-Disposition", "attachment; filename=expenses.csv");
        res.set("Content-Type", "text/csv");
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).json({ message: "Failed to export expenses", error });
    }
});

const upload = multer({ storage: multer.memoryStorage() });

router.post("/import/pdf", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const pdfData = await pdfParse(req.file.buffer);
        const extractedText = pdfData.text;

        const expensePattern = /(\w+)\s+(\d+(\.\d{1,2})?)\s+(\d{4}-\d{2}-\d{2})/g;
        const expenses = [];
        let match;

        while ((match = expensePattern.exec(extractedText)) !== null) {
            expenses.push({
                category: match[1],
                amount: parseFloat(match[2]),
                createdAt: new Date(match[4]),
                user: req.user._id
            });
        }

        if (expenses.length === 0) {
            return res.status(400).json({ message: "No valid expenses found in the PDF" });
        }

        await Expense.insertMany(expenses);
        res.json({ message: "Expenses imported successfully", expenses });
    } catch (error) {
        res.status(500).json({ message: "Failed to parse PDF", error });
    }
});

router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ createdAt: -1 });
        await client.setEx(`expenses:${req.user._id}`, 600, JSON.stringify(expenses));
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch expenses", error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { category, amount, comments } = req.body;
    try {
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id }, 
            { category, amount, comments, updatedAt: Date.now() },
            { new: true }
        );
        await clearCache(req.user._id); 
        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: "Failed to update expense", error: error.message });
    }
});

// Delete Expense
router.delete('/:id', async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id }); 
        if (!expense) {
            return res.status(404).json({ message: "Expense not found or not authorized" });
        }
        await clearCache(req.user._id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Failed to delete expense", error: error.message });
    }
});

module.exports = router;

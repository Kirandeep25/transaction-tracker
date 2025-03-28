const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    comments: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
});
ExpenseSchema.index({ user: 1, createdAt: -1 }); 
ExpenseSchema.index({ category: 1 });
module.exports = mongoose.model('Expense', ExpenseSchema);

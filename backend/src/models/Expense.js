const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Software/Tools', 'Gear/Equipment', 'Contractors/Editors', 'Marketing', 'Other']
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    description: {
        type: String,
        required: [true, 'Please add a brief description']
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Expense', ExpenseSchema);

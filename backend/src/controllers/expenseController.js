const Expense = require('../models/Expense');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../middlewares/errorHandler');

exports.createExpense = asyncHandler(async (req, res) => {
    const { category, amount, description } = req.body;
    const user = req.user.id; // User must be authenticated

    if (!category || !amount || !description) {
        throw new AppError('Please provide all expense details', 400);
    }

    const expense = await Expense.create({ category, amount, description, user });
    res.status(201).json(expense);
});

exports.getExpenses = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 50;

    const expenses = await Expense.find({ user: req.user.id })
        .sort('-date')
        .limit(limit)
        .lean();

    res.status(200).json(expenses);
});

exports.deleteExpense = asyncHandler(async (req, res, next) => {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

    if (!expense) {
        return next(new AppError('Expense not found', 404));
    }

    await expense.deleteOne();
    res.status(200).json({ success: true, message: 'Expense deleted successfully' });
});

const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Secure route

router.route('/')
    .get(getExpenses)
    .post(createExpense);

router.route('/:id')
    .delete(deleteExpense);

module.exports = router;

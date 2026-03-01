const express = require('express');
const router = express.Router();
const {
    getTasks,
    createTask,
    reorderTasks,
    deleteTask,
} = require('../controllers/taskController');

const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Protect all task routes

router.route('/').get(getTasks).post(createTask);
router.route('/reorder').put(reorderTasks);
router.route('/:id').delete(deleteTask);

module.exports = router;

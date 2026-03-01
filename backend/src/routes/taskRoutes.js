const express = require('express');
const router = express.Router();
const {
    getTasks,
    createTask,
    reorderTasks,
    deleteTask,
    updateTask
} = require('../controllers/taskController');

const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Protect all task routes

router.route('/').get(getTasks).post(createTask);
router.route('/reorder').put(reorderTasks);
router.route('/:id').delete(deleteTask).put(updateTask);

module.exports = router;

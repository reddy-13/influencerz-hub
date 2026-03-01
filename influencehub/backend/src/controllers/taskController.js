const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const { AppError } = require('../middlewares/errorHandler');

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    // Lean for massive read-only boost
    const tasks = await Task.find({ user: userId }).sort({ order: 1 }).lean();
    res.status(200).json(tasks);
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
    const { content, status, tag } = req.body;
    const userId = req.user.id;

    // Find highest order in this status
    const lastTask = await Task.findOne({ user: userId, status }).sort({ order: -1 });
    const newOrder = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
        content,
        status: status || 'ideas',
        tag: tag || 'Draft',
        order: newOrder,
        user: userId,
    });

    res.status(201).json(task);
});

// @desc    Update task (and reorder)
// @route   PUT /api/tasks/reorder
// @access  Private
exports.reorderTasks = asyncHandler(async (req, res, next) => {
    const { tasks } = req.body;
    const userId = req.user.id;

    // tasks should be an array of { _id, status, order }
    if (!tasks || !Array.isArray(tasks)) {
        return next(new AppError('Please provide an array of tasks to update', 400));
    }

    // Bulk write update
    const bulkOps = tasks.map((t) => ({
        updateOne: {
            filter: { _id: t._id, user: userId },
            update: { $set: { status: t.status, order: t.order } },
        },
    }));

    if (bulkOps.length > 0) {
        await Task.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: 'Tasks reordered successfully' });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
exports.deleteTask = asyncHandler(async (req, res, next) => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
        return next(new AppError('Task not found', 404));
    }

    res.status(200).json({ message: 'Task removed' });
});

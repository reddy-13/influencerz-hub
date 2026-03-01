const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Task content is required'],
            trim: true,
        },
        tag: {
            type: String,
            default: 'Draft',
        },
        status: {
            type: String,
            enum: ['ideas', 'scripting', 'filming', 'editing', 'published'],
            default: 'ideas',
        },
        script: {
            type: String,
            default: '',
        },
        subtasks: [
            {
                id: { type: String, required: true },
                title: { type: String, required: true },
                completed: { type: Boolean, default: false }
            }
        ],
        order: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

TaskSchema.index({ status: 1, order: 1 });

module.exports = mongoose.model('Task', TaskSchema);

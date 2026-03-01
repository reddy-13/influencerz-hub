const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Add indexing for rapid pagination and user-fetching scale
videoSchema.index({ createdAt: -1 });
videoSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Video', videoSchema);
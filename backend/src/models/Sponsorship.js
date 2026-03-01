const mongoose = require('mongoose');

const sponsorshipSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  amount: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Add indexing for rapid pagination and user-fetching scale
sponsorshipSchema.index({ createdAt: -1 });
sponsorshipSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
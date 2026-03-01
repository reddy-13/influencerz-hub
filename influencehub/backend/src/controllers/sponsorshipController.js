const Sponsorship = require('../models/Sponsorship');
const { AppError } = require('../middlewares/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

// Create a new sponsorship deal
exports.createSponsorship = asyncHandler(async (req, res) => {
    const { brand, amount } = req.body;
    const user = req.user.id;

    if (!brand || !amount) {
        throw new AppError('Brand and Amount are required', 400);
    }

    const sponsorship = new Sponsorship({ brand, amount, user });
    await sponsorship.save();
    res.status(201).json(sponsorship);
});

// Get all active sponsorships
exports.getSponsorships = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const sponsorships = await Sponsorship.find({ user: req.user.id })
        .populate('user', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

    res.json(sponsorships);
});

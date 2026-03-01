const Video = require('../models/Video');
const { AppError } = require('../middlewares/errorHandler');
const asyncHandler = require('../utils/asyncHandler');

// Upload a new video
exports.uploadVideo = asyncHandler(async (req, res) => {
    const { title, description, url } = req.body;
    const user = req.user.id;

    if (!title || !url) {
        throw new AppError('Title and URL are required', 400);
    }

    const video = new Video({ title, description, url, user });
    await video.save();
    res.status(201).json(video);
});

// Get all videos with pagination
exports.getVideos = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ user: req.user.id })
        .populate('user', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

    res.json(videos);
});

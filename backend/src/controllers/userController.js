const User = require('../models/User');
const Task = require('../models/Task');
const Video = require('../models/Video');
const Sponsorship = require('../models/Sponsorship');
const { AppError } = require('../middlewares/errorHandler');
const asyncHandler = require('../utils/asyncHandler');
const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URI || 'redis://127.0.0.1:6379';
const redis = new Redis(redisUrl);

const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });
};

// Logout a user
exports.logout = asyncHandler(async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});

// Register a new user
exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new AppError('Name, email, and password are required', 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('User already exists', 400);
    }

    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
});

// Login a user
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('Email and password are required', 400);
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    if (user.status === 'suspended') {
        throw new AppError('Your account has been suspended by the administrator.', 403);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new AppError('Invalid email or password', 401);
    }

    sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
});

// Server-Side Caching (Scale: 100M Users)
// In a true enterprise environment, this would be Redis. Here, we use high-speed Node Memory. -> Now upgraded to real Redis!
const CACHE_TTL_SECONDS = 300; // 5 Minute Cache Lock 

exports.getAdminMetrics = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new AppError('Not authorized as an admin', 403);
    }

    // Pagination setup
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let aggregateMetrics;

    // Cache short-circuit: Check Redis for existing metrics
    const cachedMetrics = await redis.get('admin_metrics:overview');

    if (cachedMetrics) {
        aggregateMetrics = JSON.parse(cachedMetrics);
    } else {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Run aggregate metrics in parallel for speed optimization
        const data = await Promise.all([
            // Use estimatedDocumentCount() instead of countDocuments() for total counts (1000x faster globally)
            User.estimatedDocumentCount(),
            User.countDocuments({ status: 'active' }),
            User.countDocuments({ status: 'suspended' }),
            Video.estimatedDocumentCount(),
            Sponsorship.estimatedDocumentCount(),
            Task.estimatedDocumentCount(),
            // Total Revenue Aggregation
            Sponsorship.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
            // Monthly Revenue Aggregation
            Sponsorship.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);

        aggregateMetrics = {
            totalUsers: data[0],
            activeUsers: data[1],
            suspendedUsers: data[2],
            totalVideos: data[3],
            totalSponsorships: data[4],
            totalTasks: data[5],
            totalRevenue: data[6][0]?.total || 0,
            monthlyRevenue: data[7][0]?.total || 0
        };

        // Persist to cluster memory cache lock -> Persist to Redis
        await redis.setex('admin_metrics:overview', CACHE_TTL_SECONDS, JSON.stringify(aggregateMetrics));
    }

    const { totalUsers, activeUsers, suspendedUsers, totalVideos, totalSponsorships, totalTasks, totalRevenue, monthlyRevenue } = aggregateMetrics;

    // Optimized bulk query utilizing lean() to skip mongoose document hydrations
    const users = await User.find()
        .select('-password -__v')
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
        .lean(); // Massive performance boost for read-only json feeds

    // Tell browsers and proxies to safely cache the identical paginated list for exactly 30 seconds
    res.set('Cache-Control', 'public, max-age=30, s-maxage=30');

    res.status(200).json({
        success: true,
        metrics: {
            totalUsers,
            activeUsers,
            suspendedUsers,
            totalVideos,
            totalSponsorships,
            totalTasks,
            totalRevenue,
            monthlyRevenue
        },
        users,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(totalUsers / limit),
            totalCount: totalUsers
        }
    });
});

exports.updateUserStatus = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new AppError('Not authorized as an admin', 403);
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
        throw new AppError('Invalid status value', 400);
    }

    const user = await User.findById(id);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (user.role === 'admin') {
        throw new AppError('Cannot suspend other administrators', 403);
    }

    user.status = status;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User status updated to ${status}`
    });
});

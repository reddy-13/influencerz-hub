const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./errorHandler');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        throw new AppError('Not authorized to access this route', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_dev_12345');
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            throw new AppError('The user belonging to this token no longer exists.', 401);
        }

        next();
    } catch (error) {
        throw new AppError('Not authorized to access this route', 401);
    }
});

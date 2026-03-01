const rateLimit = require('express-rate-limit');

// Strict Login Bruteforce Protection
exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes lock
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: {
        success: false,
        message: 'Too many login attempts from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Standard API Rate Limiter
exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 150, // Limit each IP to 150 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // Max 100 requests per IP per 15 mins
    message: 'Too many requests from this IP, please try again later.',
});

const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 min
    max: 5, // Max 5 login/signup per IP
    message: 'Too many auth attempts, please slow down.',
});

module.exports = { globalLimiter, authLimiter };

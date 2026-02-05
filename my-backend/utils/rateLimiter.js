const rateLimit = new Map();

/**
 * Simple Sliding Window Rate Limiter
 * @param {string} keyPrefix - Prefix for the key (e.g., 'otp_req')
 * @param {number} limit - Max requests
 * @param {number} windowSeconds - Time window in seconds
 */
const rateLimiter = (keyPrefix, limit, windowSeconds) => {
    return (req, res, next) => {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const key = `${keyPrefix}:${ip}`;
        const now = Date.now();
        const windowStart = now - (windowSeconds * 1000);

        // Get requests for this key
        let timestamps = rateLimit.get(key) || [];

        // Filter out old timestamps
        timestamps = timestamps.filter(ts => ts > windowStart);

        if (timestamps.length >= limit) {
            return res.status(429).json({
                message: 'Too many requests, please try again later.'
            });
        }

        // Add current request
        timestamps.push(now);
        rateLimit.set(key, timestamps);

        // Cleanup OLD keys occasionally (optimization omitted for brevity)

        next();
    };
};

module.exports = rateLimiter;

/**
 * Production-grade HTTP security headers middleware.
 */
export function securityHeaders(req, res, next) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' http://localhost:5001 http://localhost:5173 https:; script-src 'self' 'unsafe-inline';");
    next();
}
/**
 * In-memory token bucket rate limiter.
 */
export function createRateLimiter(options) {
    const store = {};
    const { windowMs, maxRequests, message = 'Too many requests. Please try again later.' } = options;
    // Clean stale records every 5 minutes
    setInterval(() => {
        const now = Date.now();
        for (const ip in store) {
            if (now - store[ip].lastRefill > windowMs * 2) {
                delete store[ip];
            }
        }
    }, 300000).unref();
    return (req, res, next) => {
        // In test environment, do not throttle
        if (process.env.NODE_ENV === 'test') {
            return next();
        }
        const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
        const now = Date.now();
        if (!store[ip]) {
            store[ip] = {
                tokens: maxRequests - 1,
                lastRefill: now,
            };
            return next();
        }
        const entry = store[ip];
        const elapsedTime = now - entry.lastRefill;
        // Refill tokens proportionally to elapsed time
        const refillTokens = (elapsedTime / windowMs) * maxRequests;
        entry.tokens = Math.min(maxRequests, entry.tokens + refillTokens);
        entry.lastRefill = now;
        if (entry.tokens >= 1) {
            entry.tokens -= 1;
            return next();
        }
        const retrySecs = Math.ceil((1 - entry.tokens) * (windowMs / maxRequests) / 1000);
        res.setHeader('Retry-After', retrySecs);
        res.status(429).json({
            success: false,
            error: message,
            retryAfterSeconds: retrySecs,
        });
    };
}

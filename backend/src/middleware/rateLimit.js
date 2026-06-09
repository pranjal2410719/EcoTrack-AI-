/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse by limiting request frequency.
 *
 * @module middleware/rateLimit
 */

const rateLimit = require("express-rate-limit");

/**
 * General API rate limiter — 100 requests per 15 minutes per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please try again later.",
  },
});

/**
 * Strict rate limiter for Gemini-heavy endpoints — 20 requests per 15 minutes.
 */
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "AI service rate limit exceeded. Please wait before sending more requests.",
  },
});

module.exports = { apiLimiter, aiLimiter };

/**
 * Global Error Handler Middleware
 * Catches unhandled errors from all routes and returns consistent error responses.
 *
 * @module middleware/errorHandler
 */

/**
 * Express error-handling middleware.
 *
 * Must have 4 parameters for Express to recognize it as an error handler.
 * In development mode, the error stack trace is included in the response.
 *
 * @param {Error} err - The error object
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @param {import("express").NextFunction} _next - Express next function (unused but required)
 */
function errorHandler(err, req, res, _next) {
  console.error("Unhandled error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;

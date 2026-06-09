/**
 * Authentication Middleware
 * Verifies Supabase JWT tokens from the Authorization header.
 *
 * @module middleware/auth
 */

const supabase = require("../config/supabase");

/**
 * Authenticate requests using Supabase JWT verification.
 *
 * Extracts the Bearer token from the Authorization header,
 * verifies it with Supabase's getUser API, and attaches
 * the user object to the request for downstream handlers.
 *
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @param {import("express").NextFunction} next - Express next middleware function
 *
 * @returns {void}
 *
 * @example
 * router.get("/protected", authenticate, handler);
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Missing or invalid authorization header",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Authentication failed",
    });
  }
}

module.exports = { authenticate };

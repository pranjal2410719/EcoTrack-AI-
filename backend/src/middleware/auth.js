/**
 * Authentication middleware using Supabase JWT verification.
 * Verifies the JWT from the Authorization header using Supabase's getUser API.
 */

const supabase = require("../config/supabase");

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
    // Verify the JWT with Supabase
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

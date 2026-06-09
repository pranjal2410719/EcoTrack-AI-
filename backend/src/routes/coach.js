const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimit");
const { chatWithCoach } = require("../controllers/coachController");

/**
 * POST /api/coach/chat
 * Chat with the AI sustainability coach.
 * Requires authentication.
 */
router.post("/chat", authenticate, aiLimiter, chatWithCoach);

module.exports = router;

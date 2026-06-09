const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { chatWithCoach } = require("../controllers/coachController");

/**
 * POST /api/coach/chat
 * Chat with the AI sustainability coach.
 * Requires authentication.
 */
router.post("/chat", authenticate, chatWithCoach);

module.exports = router;

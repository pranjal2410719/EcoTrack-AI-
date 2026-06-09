const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimit");
const { validateAnalyze } = require("../validations/assessment");
const { analyzeAssessment } = require("../controllers/aiController");

/**
 * POST /api/analyze
 * Generate AI recommendations for a completed assessment.
 * Requires authentication - uses JWT from Authorization header.
 */
router.post("/", authenticate, aiLimiter, validateAnalyze, analyzeAssessment);

module.exports = router;

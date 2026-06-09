const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { validateAnalyze } = require("../validations/assessment");
const { analyzeAssessment } = require("../controllers/aiController");

/**
 * POST /api/analyze
 * Generate AI recommendations for a completed assessment.
 * Requires authentication - uses JWT from Authorization header.
 */
router.post("/", authenticate, validateAnalyze, analyzeAssessment);

module.exports = router;

const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { validateAssessment } = require("../validations/assessment");
const { createAssessment } = require("../controllers/assessmentController");

/**
 * POST /api/assessment
 * Save a carbon footprint assessment and calculate the score.
 * Requires authentication - uses JWT from Authorization header.
 */
router.post("/", authenticate, validateAssessment, createAssessment);

module.exports = router;

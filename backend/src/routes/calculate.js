const express = require("express");
const router = express.Router();
const { validateCalculate } = require("../validations/assessment");
const { calculateCarbonController } = require("../controllers/calculateController");

/**
 * POST /api/calculate
 * Calculate carbon score without saving to database.
 */
router.post("/", validateCalculate, calculateCarbonController);

module.exports = router;

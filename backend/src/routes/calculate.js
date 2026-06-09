const express = require("express");
const router = express.Router();
const { validateCalculate } = require("../validations/assessment");
const { calculateCarbonScore } = require("../services/carbonCalculator");

/**
 * POST /api/calculate
 * Calculate carbon score without saving to database.
 */
router.post("/", validateCalculate, (req, res) => {
  const { transport, electricity, diet, flights, shopping } = req.body;

  const result = calculateCarbonScore({ transport, electricity, diet, flights, shopping });

  res.json({
    success: true,
    data: {
      total: result.total,
      level: result.level,
      breakdown: result.breakdown,
    },
  });
});

module.exports = router;

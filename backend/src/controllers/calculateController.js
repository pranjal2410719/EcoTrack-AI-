const { calculateCarbonScore } = require("../services/carbonCalculator");

/**
 * POST /api/calculate
 * Calculate carbon score without saving to database.
 */
async function calculateCarbonController(req, res, next) {
  try {
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
  } catch (err) {
    next(err);
  }
}

module.exports = { calculateCarbonController };

const { calculateCarbonScore } = require("../services/carbonCalculator");

/**
 * Calculate annual savings between current and target lifestyle.
 *
 * @param {Object} current - Current lifestyle values
 * @param {Object} target - Target lifestyle values
 * @returns {Object} Savings breakdown
 */
function computeSavings(current, target) {
  const currentResult = calculateCarbonScore(current);
  const targetResult = calculateCarbonScore(target);

  const monthlyReduction = currentResult.total - targetResult.total;
  const annualReduction = monthlyReduction * 12;

  // Per-category monthly savings
  const savings = {};
  for (const key of Object.keys(currentResult.breakdown)) {
    const diff = currentResult.breakdown[key] - targetResult.breakdown[key];
    if (Math.abs(diff) > 0.01) {
      savings[key] = Math.round(diff * 100) / 100;
    }
  }

  return {
    current: {
      total: currentResult.total,
      level: currentResult.level,
      breakdown: currentResult.breakdown,
    },
    target: {
      total: targetResult.total,
      level: targetResult.level,
      breakdown: targetResult.breakdown,
    },
    monthlyReduction: Math.round(monthlyReduction * 100) / 100,
    annualReduction: Math.round(annualReduction * 100) / 100,
    categorySavings: savings,
    percentageReduction: currentResult.total > 0
      ? Math.round((monthlyReduction / currentResult.total) * 100 * 100) / 100
      : 0,
  };
}

/**
 * POST /api/simulate
 * Compare current lifestyle vs target and compute potential savings.
 */
async function simulateReduction(req, res, next) {
  try {
    const { current, target } = req.body;

    if (!current || !target) {
      return res.status(400).json({
        success: false,
        error: "Both 'current' and 'target' objects are required",
      });
    }

    const result = computeSavings(current, target);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { simulateReduction, computeSavings };

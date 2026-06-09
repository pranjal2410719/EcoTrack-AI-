const { calculateCarbonScore } = require("../services/carbonCalculator");
const supabaseService = require("../services/supabaseService");
const { createAuthedClient } = require("../config/supabase");

/**
 * POST /api/assessment
 * Save a carbon footprint assessment and calculate the score.
 */
async function createAssessment(req, res, next) {
  try {
    const { transport, electricity, diet, flights, shopping } = req.body;
    const userId = req.user.id;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    const authedSupabase = createAuthedClient(token);

    // Calculate carbon score
    const result = calculateCarbonScore({ transport, electricity, diet, flights, shopping });

    // Save assessment using authed client
    const { data: assessment, error } = await supabaseService.saveAssessment(
      {
        user_id: userId,
        transport,
        electricity,
        diet,
        flights,
        shopping,
        carbon_score: result.total,
      },
      authedSupabase,
    );

    if (error) {
      console.error("Error saving assessment:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to save assessment",
      });
    }

    res.status(201).json({
      success: true,
      data: {
        assessment,
        carbonLevel: result.level,
        breakdown: result.breakdown,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createAssessment };

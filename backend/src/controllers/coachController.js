const { generateCoachResponse } = require("../services/coachService");
const supabaseService = require("../services/supabaseService");
const { createAuthedClient } = require("../config/supabase");

/**
 * POST /api/coach/chat
 * Send a message to the AI climate coach and get a response.
 * Optionally includes user's carbon data for personalized advice.
 */
async function chatWithCoach(req, res, next) {
  try {
    const { message, history } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const authedSupabase = createAuthedClient(token);

    // Get user's latest assessment for personalized context
    const { data: latest } = await supabaseService.getLatestAssessment(req.user.id, authedSupabase);

    let userContext = null;
    if (latest) {
      const score = latest.carbon_score;
      const level = score < 200 ? "Low" : score < 500 ? "Moderate" : "High";
      userContext = {
        transport: latest.transport,
        electricity: latest.electricity,
        diet: latest.diet,
        flights: latest.flights,
        shopping: latest.shopping,
        carbonScore: score,
        level,
      };
    }

    const response = await generateCoachResponse({ message, history, userContext });

    res.json({
      success: true,
      data: {
        response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { chatWithCoach };

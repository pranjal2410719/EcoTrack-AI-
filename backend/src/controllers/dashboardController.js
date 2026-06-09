const supabaseService = require("../services/supabaseService");
const { createAuthedClient } = require("../config/supabase");
const { getLevel } = require("../services/carbonCalculator");

/**
 * Compute category breakdown for an assessment.
 */
function computeBreakdown(assessment) {
  const transportScore = assessment.transport * 0.21;
  const electricityScore = assessment.electricity * 0.0008;
  const flightsScore = assessment.flights * 90;
  const shoppingScore = assessment.shopping * 5;
  let dietScore;
  switch (assessment.diet) {
    case "non-veg":
      dietScore = 100;
      break;
    case "vegetarian":
      dietScore = 50;
      break;
    case "vegan":
      dietScore = 20;
      break;
    default:
      dietScore = 50;
  }

  return {
    transport: Math.round(transportScore * 100) / 100,
    electricity: Math.round(electricityScore * 100) / 100,
    flights: Math.round(flightsScore * 100) / 100,
    shopping: Math.round(shoppingScore * 100) / 100,
    diet: Math.round(dietScore * 100) / 100,
  };
}

/**
 * Build progress data from history.
 */
function computeProgress(history, currentScore) {
  const current = history[history.length - 1]?.carbon_score || currentScore;
  const previous = history.length > 1 ? history[history.length - 2]?.carbon_score : current;
  const reduction =
    previous > 0 ? Math.round(((previous - current) / previous) * 100 * 100) / 100 : 0;

  return {
    lastMonth: previous,
    currentMonth: current,
    reduction: Math.max(0, reduction),
  };
}

/**
 * GET /api/dashboard
 * Fetch all dashboard data for the authenticated user.
 */
async function getDashboard(req, res, next) {
  try {
    const userId = req.user.id;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const authedSupabase = createAuthedClient(token);

    // Fetch all dashboard data in parallel for efficiency
    const [{ data: latest }, { data: allAssessments }] = await Promise.all([
      supabaseService.getLatestAssessment(userId, authedSupabase),
      supabaseService.getUserAssessments(userId, authedSupabase),
    ]);

    if (!latest) {
      return res.json({
        success: true,
        data: {
          hasAssessment: false,
          message: "No assessments found. Take your first assessment!",
        },
      });
    }

    // Get recommendations (separate query, but parallel where possible)
    const { data: recs } = await supabaseService.getRecommendations(latest.id, authedSupabase);

    const level = getLevel(latest.carbon_score);
    const breakdown = computeBreakdown(latest);

    // Build history sorted by date (oldest first)
    const history = (allAssessments || []).map((a) => ({
      carbon_score: a.carbon_score,
      created_at: a.created_at,
    }));

    // If only one assessment, add a simulated previous entry for visual progress
    if (history.length === 1) {
      const fakePrevious = Math.round(latest.carbon_score * (1 + Math.random() * 0.2 + 0.05));
      const fakeDate = new Date();
      fakeDate.setMonth(fakeDate.getMonth() - 1);
      history.push({
        carbon_score: fakePrevious,
        created_at: fakeDate.toISOString(),
      });
    }

    history.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    res.json({
      success: true,
      data: {
        hasAssessment: true,
        latestAssessment: {
          ...latest,
          level,
          breakdown,
        },
        recommendations: recs?.ai_response || null,
        history,
        progress: computeProgress(history, latest.carbon_score),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };

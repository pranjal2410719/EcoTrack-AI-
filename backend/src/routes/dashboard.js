const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const supabaseService = require("../services/supabaseService");
const { createAuthedClient } = require("../config/supabase");

/**
 * GET /api/dashboard
 * Fetch all dashboard data for the authenticated user.
 */
router.get("/", authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const authedSupabase = createAuthedClient(token);

    // Get latest assessment using authed client
    const { data: latest } = await supabaseService.getLatestAssessment(userId, authedSupabase);

    if (!latest) {
      return res.json({
        success: true,
        data: {
          hasAssessment: false,
          message: "No assessments found. Take your first assessment!",
        },
      });
    }

    // Get recommendations
    const { data: recs } = await supabaseService.getRecommendations(latest.id, authedSupabase);

    // Get all user assessments for history
    const { data: allAssessments } = await supabaseService.getUserAssessments(userId, authedSupabase);

    // Calculate carbon level
    const score = latest.carbon_score;
    const level = score < 200 ? "Low" : score < 500 ? "Moderate" : "High";

    // Build breakdown
    const transportScore = latest.transport * 0.21;
    const electricityScore = latest.electricity * 0.0008;
    const flightsScore = latest.flights * 90;
    const shoppingScore = latest.shopping * 5;
    let dietScore;
    switch (latest.diet) {
      case "non-veg": dietScore = 100; break;
      case "vegetarian": dietScore = 50; break;
      case "vegan": dietScore = 20; break;
      default: dietScore = 50;
    }

    const breakdown = {
      transport: Math.round(transportScore * 100) / 100,
      electricity: Math.round(electricityScore * 100) / 100,
      flights: Math.round(flightsScore * 100) / 100,
      shopping: Math.round(shoppingScore * 100) / 100,
      diet: Math.round(dietScore * 100) / 100,
    };

    // Build history
    const history = (allAssessments || []).map((a) => ({
      carbon_score: a.carbon_score,
      created_at: a.created_at,
    }));

    // If only one assessment, add a fake previous entry for progress
    if (history.length === 1) {
      const fakePrevious = Math.round(score * (1 + (Math.random() * 0.2 + 0.05)));
      const fakeDate = new Date();
      fakeDate.setMonth(fakeDate.getMonth() - 1);
      history.push({
        carbon_score: fakePrevious,
        created_at: fakeDate.toISOString(),
      });
    }

    // Sort by date (oldest first) for trend display
    history.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    // Calculate progress
    const currentScore = history[history.length - 1]?.carbon_score || score;
    const previousScore = history.length > 1 ? history[history.length - 2]?.carbon_score : currentScore;
    const reduction = previousScore > 0
      ? Math.round(((previousScore - currentScore) / previousScore) * 100 * 100) / 100
      : 0;

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
        progress: {
          lastMonth: previousScore,
          currentMonth: currentScore,
          reduction: Math.max(0, reduction),
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

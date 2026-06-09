const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { validateAnalyze } = require("../validations/assessment");
const { generateRecommendations } = require("../services/geminiService");
const supabaseService = require("../services/supabaseService");
const { createAuthedClient } = require("../config/supabase");

/**
 * POST /api/analyze
 * Generate AI recommendations for a completed assessment.
 * Requires authentication - uses JWT from Authorization header.
 */
router.post("/", authenticate, validateAnalyze, async (req, res, next) => {
  try {
    const { assessmentId } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    // Create an authed Supabase client with the user's JWT for RLS compliance
    const authedSupabase = createAuthedClient(token);

    // Get assessment from db
    const { data: assessment, error } = await authedSupabase
      .from("assessments")
      .select("*")
      .eq("id", assessmentId)
      .single();

    if (error || !assessment) {
      return res.status(404).json({
        success: false,
        error: "Assessment not found",
      });
    }

    // Generate AI recommendations
    const aiResponse = await generateRecommendations({
      transport: assessment.transport,
      electricity: assessment.electricity,
      diet: assessment.diet,
      flights: assessment.flights,
      shopping: assessment.shopping,
      carbonScore: assessment.carbon_score,
      level: assessment.carbon_score < 200 ? "Low" : assessment.carbon_score < 500 ? "Moderate" : "High",
    });

    // Save recommendations using authed client
    const { data: saved, error: saveErr } = await supabaseService.saveRecommendations(
      assessmentId,
      { text: aiResponse },
      authedSupabase
    );

    if (saveErr) {
      console.error("Error saving recommendations:", saveErr);
    }

    res.json({
      success: true,
      data: {
        analysis: aiResponse,
        saved: !!saved,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

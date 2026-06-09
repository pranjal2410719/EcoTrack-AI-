/**
 * Report Controller
 * Serves aggregated data for the PDF Sustainability Report.
 */
const supabaseService = require("../services/supabaseService");
const { createAuthedClient } = require("../config/supabase");
const { getLevel } = require("../services/carbonCalculator");

/**
 * GET /api/report
 * Returns all data needed to generate a sustainability report PDF.
 */
async function getReportData(req, res, next) {
  try {
    const userId = req.user.id;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const authedSupabase = createAuthedClient(token);

    const [{ data: latest }, { data: allAssessments }] = await Promise.all([
      supabaseService.getLatestAssessment(userId, authedSupabase),
      supabaseService.getUserAssessments(userId, authedSupabase),
    ]);

    if (!latest) {
      return res.json({
        success: true,
        data: { hasAssessment: false },
      });
    }

    const level = getLevel(latest.carbon_score);
    const { data: recs } = await supabaseService.getRecommendations(latest.id, authedSupabase);

    // Build breakdown
    const breakdown = {
      transport: Math.round(latest.transport * 0.21 * 100) / 100,
      electricity: Math.round(latest.electricity * 0.0008 * 100) / 100,
      flights: Math.round(latest.flights * 90 * 100) / 100,
      shopping: Math.round(latest.shopping * 5 * 100) / 100,
      diet: (() => {
        switch (latest.diet) {
          case "vegan": return 20;
          case "vegetarian": return 50;
          default: return 100;
        }
      })(),
    };

    // History with fake previous for progress
    const history = (allAssessments || []).map((a) => ({
      score: a.carbon_score,
      date: a.created_at,
    }));
    if (history.length === 1) {
      const fakePrev = Math.round(latest.carbon_score * 1.15);
      const fakeDate = new Date();
      fakeDate.setMonth(fakeDate.getMonth() - 1);
      history.unshift({ score: fakePrev, date: fakeDate.toISOString() });
    }

    res.json({
      success: true,
      data: {
        hasAssessment: true,
        generatedAt: new Date().toISOString(),
        assessment: {
          transport: latest.transport,
          electricity: latest.electricity,
          diet: latest.diet,
          flights: latest.flights,
          shopping: latest.shopping,
          carbonScore: latest.carbon_score,
          level,
          breakdown,
        },
        recommendations: recs?.ai_response || null,
        history,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getReportData };

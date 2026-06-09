/**
 * Get the default or authed Supabase client.
 */
function getClient(authClient) {
  return authClient || require("../config/supabase");
}

/**
 * Save a new assessment.
 */
async function saveAssessment(assessmentData, authClient) {
  const db = getClient(authClient);
  const { data, error } = await db
    .from("assessments")
    .insert([assessmentData])
    .select()
    .single();
  return { data, error };
}

/**
 * Save AI recommendations for an assessment.
 */
async function saveRecommendations(assessmentId, aiResponse, authClient) {
  const db = getClient(authClient);
  const { data, error } = await db
    .from("recommendations")
    .insert([{ assessment_id: assessmentId, ai_response: aiResponse }])
    .select()
    .single();
  return { data, error };
}

/**
 * Get latest assessment for a user.
 */
async function getLatestAssessment(userId, authClient) {
  const db = getClient(authClient);
  const { data, error } = await db
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return { data, error };
}

/**
 * Get all assessments for a user (for history).
 */
async function getUserAssessments(userId, authClient) {
  const db = getClient(authClient);
  const { data, error } = await db
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
}

/**
 * Get recommendations for an assessment.
 */
async function getRecommendations(assessmentId, authClient) {
  const db = getClient(authClient);
  const { data, error } = await db
    .from("recommendations")
    .select("*")
    .eq("assessment_id", assessmentId)
    .maybeSingle();
  return { data, error };
}

module.exports = {
  saveAssessment,
  saveRecommendations,
  getLatestAssessment,
  getUserAssessments,
  getRecommendations,
};

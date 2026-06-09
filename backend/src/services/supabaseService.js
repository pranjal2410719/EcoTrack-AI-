/**
 * Supabase Database Service
 * Provides a clean abstraction layer over Supabase database operations.
 * All functions accept an optional authenticated client for RLS compliance.
 *
 * @module services/supabaseService
 */

const defaultClient = require("../config/supabase");

/**
 * Get the Supabase client, preferring an authenticated client if provided.
 *
 * @param {Object} [authClient] - Authenticated Supabase client (from createAuthedClient)
 * @returns {Object} Supabase client instance
 */
function getClient(authClient) {
  return authClient || defaultClient;
}

/**
 * Save a new carbon footprint assessment.
 *
 * @param {Object} assessmentData - Assessment data to insert
 * @param {string} assessmentData.user_id - UUID of the user
 * @param {number} assessmentData.transport - Weekly transport distance
 * @param {number} assessmentData.electricity - Monthly electricity bill
 * @param {string} assessmentData.diet - Diet type
 * @param {number} assessmentData.flights - Flights per year
 * @param {number} assessmentData.shopping - Purchases per month
 * @param {number} assessmentData.carbon_score - Calculated carbon score
 * @param {Object} [authClient] - Authenticated Supabase client
 * @returns {Promise<{data: Object|null, error: Object|null}>} Result with inserted assessment
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
 * Save AI-generated recommendations for an assessment.
 *
 * @param {string} assessmentId - UUID of the assessment
 * @param {Object} aiResponse - AI response object to store
 * @param {Object} [authClient] - Authenticated Supabase client
 * @returns {Promise<{data: Object|null, error: Object|null}>} Result with saved recommendations
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
 * Get the most recent assessment for a user.
 *
 * @param {string} userId - UUID of the user
 * @param {Object} [authClient] - Authenticated Supabase client
 * @returns {Promise<{data: Object|null, error: Object|null}>} Latest assessment or null
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
 * Get all assessments for a user, ordered by most recent first.
 *
 * @param {string} userId - UUID of the user
 * @param {Object} [authClient] - Authenticated Supabase client
 * @returns {Promise<{data: Array<Object>|null, error: Object|null}>} Array of assessments
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
 * Get AI recommendations for a specific assessment.
 *
 * @param {string} assessmentId - UUID of the assessment
 * @param {Object} [authClient] - Authenticated Supabase client
 * @returns {Promise<{data: Object|null, error: Object|null}>} Recommendations or null
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

/**
 * Google Gemini AI Service
 * Provides AI-powered sustainability recommendations and coaching.
 *
 * @module services/geminiService
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * @typedef {Object} AssessmentData
 * @property {number} transport - Weekly transport distance in km
 * @property {number} electricity - Monthly electricity bill in ₹
 * @property {string} diet - Diet type: vegan, vegetarian, non-veg
 * @property {number} flights - Number of flights per year
 * @property {number} shopping - Online purchases per month
 * @property {number} carbonScore - Total carbon footprint score
 * @property {string} level - Carbon level: Low, Moderate, High
 */

/**
 * Generate personalized sustainability recommendations using Gemini AI.
 *
 * The AI analyzes the user's carbon footprint data and provides:
 * - Carbon analysis identifying biggest emission sources
 * - Top 5 personalized actionable recommendations
 * - Expected CO₂ reduction estimates for each action
 * - A practical 7-day sustainability plan
 *
 * @param {AssessmentData} assessmentData - User's carbon footprint data
 * @returns {Promise<string>} Markdown-formatted AI recommendations
 *
 * @throws {Error} If the Gemini API call fails
 */
async function generateRecommendations(assessmentData) {
  const { transport, electricity, diet, flights, shopping, carbonScore, level } = assessmentData;

  const prompt = `You are a sustainability expert.

User Carbon Footprint Data:
- Transport: ${transport} km/week
- Electricity: ₹${electricity}/month
- Diet: ${diet}
- Flights: ${flights}/year
- Shopping: ${shopping} purchases/month

Total Carbon Score: ${carbonScore}
Carbon Level: ${level}

Provide a structured response with the following sections:

1. **Carbon Analysis**: A brief analysis of the user's carbon footprint. What are their biggest emission sources? Be specific.

2. **Top 5 Actions**: List exactly 5 specific, actionable recommendations to reduce their carbon footprint. Each should be personalized based on their specific data.

3. **Expected Impact**: For each recommendation, estimate the potential CO₂ reduction in kg/year.

4. **Weekly Sustainability Plan**: A simple, practical 7-day plan with one small action per day.

Keep the entire response under 300 words. Use simple, encouraging language. Format using markdown with clear section headers.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw new Error("Failed to generate AI recommendations");
  }
}

module.exports = { generateRecommendations };

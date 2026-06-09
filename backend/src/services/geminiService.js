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
    // Graceful fallback — return data-driven recommendations
    return getFallbackRecommendations(assessmentData);
  }
}

/**
 * Provide meaningful fallback recommendations when Gemini API is unavailable.
 * Uses the user's actual carbon data to generate personalized advice.
 */
function getFallbackRecommendations(data) {
  const { transport, electricity, diet, flights, shopping, carbonScore, level } = data;
  const tips = [];

  // Transport tips
  if (transport > 100) {
    tips.push(`🚗 **Reduce driving** — You drive ${transport} km/week. Try carpooling twice a week or using public transport 3 days a week to save ~${Math.round(transport * 0.21 * 12 * 0.3)} kg CO₂/year.`);
  } else if (transport > 0) {
    tips.push(`🚗 **Optimize transport** — You drive ${transport} km/week. Combining errands into fewer trips can reduce emissions by up to 20%.`);
  }

  // Electricity tips
  if (electricity > 2000) {
    tips.push(`⚡ **Cut electricity costs** — Your bill is ₹${electricity}/month. Switching to LED bulbs and 5-star appliances can save ~${Math.round(electricity * 0.0008 * 12 * 0.3)} kg CO₂/year.`);
  } else if (electricity > 500) {
    tips.push(`⚡ **Save energy** — Unplug devices when not in use and use natural light during the day to reduce your ₹${electricity}/month bill further.`);
  }

  // Diet tips
  if (diet === "non-veg") {
    tips.push(`🥦 **Go plant-based** — Try 3 meatless days per week. Going vegetarian would save ~600 kg CO₂/year compared to a meat-heavy diet.`);
  } else if (diet === "vegetarian") {
    tips.push(`🥦 **Eat green** — You're already vegetarian! Going fully vegan would save an additional ~360 kg CO₂/year.`);
  } else if (diet === "vegan") {
    tips.push(`🌱 **Great diet choice!** — Your vegan diet saves ~960 kg CO₂/year compared to a meat-heavy diet.`);
  }

  // Flights tips
  if (flights > 2) {
    tips.push(`✈️ **Fly smarter** — You take ${flights} flights/year. Each short-haul flight emits ~90 kg CO₂. Consider trains for distances under 500 km.`);
  } else if (flights > 0) {
    tips.push(`✈️ **Low flyer** — You take ${flights} flight(s)/year. Choose economy class and direct flights to minimize per-trip emissions.`);
  }

  // Shopping tips
  if (shopping > 5) {
    tips.push(`🛍️ **Conscious shopping** — You order ${shopping}x/month. Consolidating shipments and choosing slower delivery cuts packaging waste by 40%.`);
  }

  // Add a general tip if we have very few
  if (tips.length < 2) {
    tips.push(`📊 **Track your progress** — Regular monthly check-ins help you stay motivated. Your current score is ${carbonScore} kg CO₂ (${level} impact).`);
    tips.push(`💚 **Small changes add up** — Every sustainable choice matters. Set specific goals on your dashboard and track your progress!`);
  }

  const header = `## 🌿 Your Personalized Sustainability Plan\n\n**Your Score:** ${carbonScore} kg CO₂ (${level} Impact)\n\n`;
  const weeklyPlan = `\n\n### 📅 7-Day Quick Start\n1. **Day 1:** Track everything you use for one day\n2. **Day 2:** Replace one car trip with walking/cycling\n3. **Day 3:** Try one plant-based meal\n4. **Day 4:** Unplug electronics when not in use\n5. **Day 5:** Say no to single-use plastic\n6. **Day 6:** Buy local produce\n7. **Day 7:** Review your week — celebrate progress!`;

  return header + tips.join("\n\n") + weeklyPlan;
}

module.exports = { generateRecommendations };

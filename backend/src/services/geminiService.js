const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generate sustainability recommendations using Gemini.
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

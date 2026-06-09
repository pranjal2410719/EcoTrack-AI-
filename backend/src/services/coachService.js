const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * System prompt that sets the assistant's persona as a sustainability coach.
 */
const SYSTEM_PROMPT = `You are EcoTrack AI, a friendly and knowledgeable sustainability coach. 
Your goal is to help users understand and reduce their carbon footprint.

Rules:
- Be encouraging and supportive — never judgmental
- Provide specific, actionable advice
- Use simple language (avoid jargon)
- When asked about specific habits, give personalized estimates
- Keep responses concise (under 200 words)
- If the user shares their carbon data, reference it in your advice
- Focus on high-impact changes first (transport, diet, energy)
- Mention local/regional context when relevant (India-focused tips)

You can help with:
- Understanding carbon footprint concepts
- Suggesting emission reduction strategies
- Estimating impact of lifestyle changes
- Recommending sustainable alternatives
- Creating weekly action plans
- Answering eco-related questions`;

/**
 * @typedef {Object} CoachMessage
 * @property {string} role - "user" | "assistant"
 * @property {string} content - Message text
 */

/**
 * @typedef {Object} CoachRequest
 * @property {string} message - User's current message
 * @property {CoachMessage[]} history - Previous conversation messages
 * @property {Object} [userContext] - Optional user carbon footprint data
 */

/**
 * Generate an AI coaching response for the climate coach chat.
 * Uses Gemini with conversation history for contextual responses.
 *
 * @param {CoachRequest} request - The chat request
 * @returns {Promise<string>} AI response text
 */
async function generateCoachResponse({ message, history = [], userContext = null }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build the prompt with context
    let contextBlock = "";
    if (userContext) {
      contextBlock = `\n\nUser's Carbon Footprint Data:\n- Transport: ${userContext.transport || "N/A"} km/week\n- Electricity: ₹${userContext.electricity || "N/A"}/month\n- Diet: ${userContext.diet || "N/A"}\n- Flights: ${userContext.flights || "N/A"}/year\n- Shopping: ${userContext.shopping || "N/A"} purchases/month\n- Carbon Score: ${userContext.carbonScore || "N/A"} kg CO₂\n- Level: ${userContext.level || "N/A"}\n`;
    }

    // Format recent conversation history (last 6 messages for context)
    const recentHistory = history.slice(-6);
    const historyBlock = recentHistory
      .map((msg) => `${msg.role === "user" ? "User" : "Coach"}: ${msg.content}`)
      .join("\n");

    const fullPrompt = `${SYSTEM_PROMPT}${contextBlock}\n\nConversation so far:\n${historyBlock}\n\n${historyBlock ? "" : ""}User: ${message}\nCoach:`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topP: 0.9,
      },
    });

    const text = result.response.text();
    return text;
  } catch (error) {
    console.error("Gemini Coach API error:", error.message);
    // Graceful fallback — return helpful cached-style content
    return getFallbackCoachResponse({ message, userContext });
  }
}

/**
 * Provide a meaningful fallback response when Gemini API is unavailable.
 * Uses the user's carbon data to give personalized, actionable advice.
 */
function getFallbackCoachResponse({ message, userContext }) {
  const lowImpactTips = [
    "🌱 **Great job!** Your carbon footprint is already low. To maintain this:",
    "• Keep using public transport or carpooling",
    "• Continue your plant-rich diet choices",
    "• Inspire friends and family to track their footprint too!",
    "• Consider offsetting your remaining emissions through tree-planting initiatives",
  ];

  const moderateImpactTips = [
    "🌿 **You're on the right track!** Here are ways to reduce further:",
    "• Try meatless meals 3 days a week",
    "• Switch to LED bulbs and 5-star rated appliances",
    "• Combine errands into fewer car trips",
    "• Use a programmable thermostat to reduce AC usage",
    "• Choose train over plane for short-distance travel",
  ];

  const highImpactTips = [
    "🔥 **Ready for a change?** Here's where you can make the biggest impact:",
    "• Start with your commute — try public transport or carpooling twice a week",
    "• Reduce AC usage by 2°C — saves ~100 kg CO₂/year",
    "• Switch to a plant-based meal plan gradually",
    "• Avoid single-use plastics and packaging",
    "• Consider renewable energy options for your home",
  ];

  const generalTips = [
    "💚 **AI Coach is temporarily unavailable.** In the meantime:",
    "• Track your monthly emissions to spot trends",
    "• Set sustainability goals on your dashboard",
    "• Use the Carbon Simulator to compare lifestyle changes",
    "• Every small step counts — consistency matters more than perfection!",
  ];

  let tips;
  if (!userContext) {
    tips = generalTips;
  } else if ((userContext.carbonScore || 0) < 200) {
    tips = lowImpactTips;
  } else if ((userContext.carbonScore || 0) < 500) {
    tips = moderateImpactTips;
  } else {
    tips = highImpactTips;
  }

  return tips.join("\n");
}

module.exports = { generateCoachResponse };

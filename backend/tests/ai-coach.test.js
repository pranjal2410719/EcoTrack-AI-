/**
 * AI Coach Integration Test
 * Verifies that the Gemini API key is configured and the coach service works.
 * This test calls the actual Gemini API, so it requires a valid GEMINI_API_KEY in .env
 */

const { generateCoachResponse } = require("../src/services/coachService");

// Skip if no API key is configured
const hasApiKey = !!process.env.GEMINI_API_KEY;

(hasApiKey ? describe : describe.skip)("AI Coach Integration", () => {
  jest.setTimeout(30000); // Gemini can take a few seconds

  it("should return a response for a simple question", async () => {
    const result = await generateCoachResponse({
      message: "What's one simple thing I can do to reduce my carbon footprint?",
      history: [],
    });

    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(10);
    console.log("✅ AI Coach response received:", result.substring(0, 100) + "...");
  });

  it("should include user context when provided", async () => {
    const result = await generateCoachResponse({
      message: "How can I improve?",
      history: [],
      userContext: {
        transport: 150,
        diet: "non-veg",
        carbonScore: 450,
        level: "Moderate",
      },
    });

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(10);
    console.log("✅ AI Coach with context response received:", result.substring(0, 100) + "...");
  });
});

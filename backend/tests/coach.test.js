/**
 * Coach API Tests
 *
 * Mocks all external dependencies to test the full chat flow:
 * - Supabase auth.getUser (to pass auth middleware)
 * - Supabase getLatestAssessment (to provide carbon context)
 * - Coach service generateCoachResponse (to avoid real Gemini calls)
 */

// ── Mocks must be defined BEFORE requiring the app ──

const mockUserId = "00000000-0000-0000-0000-000000000001";

// Mock Supabase config — affects auth middleware
jest.mock("../src/config/supabase", () => {
  const mockGetUser = jest.fn();
  return {
    auth: {
      getUser: mockGetUser,
    },
    createAuthedClient: jest.fn(() => ({
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({
              limit: () => ({
                maybeSingle: () => Promise.resolve({ data: null, error: null }),
              }),
            }),
          }),
          insert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        }),
      }),
    })),
  };
});

// Mock supabaseService — affects coach controller's DB calls
jest.mock("../src/services/supabaseService", () => ({
  getLatestAssessment: jest.fn(),
  saveAssessment: jest.fn(),
  saveRecommendations: jest.fn(),
  getUserAssessments: jest.fn(),
  getRecommendations: jest.fn(),
}));

// Mock coachService — affects coach controller's Gemini call
jest.mock("../src/services/coachService", () => ({
  generateCoachResponse: jest.fn(),
}));

// ── Import after mocks are set up ──
const request = require("supertest");
const app = require("../src/server");
const supabase = require("../src/config/supabase");
const supabaseService = require("../src/services/supabaseService");
const { generateCoachResponse } = require("../src/services/coachService");

describe("AI Coach — Full Chat Flow (mocked)", () => {
  describe("POST /api/coach/chat (auth gate)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return 401 without auth token", async () => {
      const res = await request(app)
        .post("/api/coach/chat")
        .send({ message: "Hello", history: [] });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 401 with malformed auth header", async () => {
      const res = await request(app)
        .post("/api/coach/chat")
        .set("Authorization", "InvalidToken")
        .send({ message: "Hello", history: [] });

      expect(res.statusCode).toBe(401);
    });

    it("should return 401 with empty Bearer token", async () => {
      const res = await request(app)
        .post("/api/coach/chat")
        .set("Authorization", "Bearer ")
        .send({ message: "Hello", history: [] });

      expect(res.statusCode).toBe(401);
    });

    it("should return 401 when auth.getUser returns error", async () => {
      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: "Invalid token" },
      });

      const res = await request(app)
        .post("/api/coach/chat")
        .set("Authorization", "Bearer fake-token")
        .send({ message: "Hello", history: [] });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/coach/chat — successful chat", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      // Make auth.getUser return a fake user
      supabase.auth.getUser.mockResolvedValue({
        data: {
          user: { id: mockUserId, email: "test@example.com" },
        },
        error: null,
      });
    });

    it("should return 200 with a coach response when no assessment data exists", async () => {
      // No assessment data (new user)
      supabaseService.getLatestAssessment.mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock Gemini response
      const mockResponse = "Great question! Here are some tips to reduce your footprint...";
      generateCoachResponse.mockResolvedValue(mockResponse);

      const res = await request(app)
        .post("/api/coach/chat")
        .set("Authorization", "Bearer valid-token")
        .send({
          message: "How can I reduce my carbon footprint?",
          history: [],
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.response).toBe(mockResponse);
      expect(res.body.data).toHaveProperty("timestamp");

      // Verify the coach service was called with correct args
      expect(generateCoachResponse).toHaveBeenCalledTimes(1);
      expect(generateCoachResponse).toHaveBeenCalledWith({
        message: "How can I reduce my carbon footprint?",
        history: [],
        userContext: null, // No assessment = no context
      });
    });

    it("should include user carbon context when assessment exists", async () => {
      // Mock assessment data
      supabaseService.getLatestAssessment.mockResolvedValue({
        data: {
          id: "assessment-1",
          transport: 150,
          electricity: 2500,
          diet: "non-veg",
          flights: 3,
          shopping: 5,
          carbon_score: 450,
          created_at: new Date().toISOString(),
        },
        error: null,
      });

      const mockResponse = "Based on your carbon footprint, I recommend...";
      generateCoachResponse.mockResolvedValue(mockResponse);

      const res = await request(app)
        .post("/api/coach/chat")
        .set("Authorization", "Bearer valid-token")
        .send({
          message: "Analyze my carbon footprint",
          history: [{ role: "user", content: "Previous question" }],
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.response).toBe(mockResponse);

      // Verify the coach service received user context
      expect(generateCoachResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Analyze my carbon footprint",
          history: expect.arrayContaining([
            expect.objectContaining({ role: "user" }),
          ]),
          userContext: expect.objectContaining({
            transport: 150,
            electricity: 2500,
            diet: "non-veg",
            carbonScore: 450,
            level: "Moderate",
          }),
        }),
      );
    });

    it("should handle conversation history correctly", async () => {
      supabaseService.getLatestAssessment.mockResolvedValue({
        data: null,
        error: null,
      });

      const mockResponse = "That's a great follow-up question!";
      generateCoachResponse.mockResolvedValue(mockResponse);

      const history = [
        { role: "user", content: "What can I do about transport emissions?" },
        { role: "assistant", content: "Try using public transport or carpooling." },
      ];

      const res = await request(app)
        .post("/api/coach/chat")
        .set("Authorization", "Bearer valid-token")
        .send({ message: "Tell me more", history });

      expect(res.statusCode).toBe(200);

      // Verify history was passed to the service
      expect(generateCoachResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          history: expect.arrayContaining([
            expect.objectContaining({ role: "user" }),
            expect.objectContaining({ role: "assistant" }),
          ]),
        }),
      );
    });

    it("should handle errors from coach service gracefully", async () => {
      supabaseService.getLatestAssessment.mockResolvedValue({
        data: null,
        error: null,
      });

      // Simulate Gemini failure
      generateCoachResponse.mockRejectedValue(new Error("Gemini API error"));

      const res = await request(app)
        .post("/api/coach/chat")
        .set("Authorization", "Bearer valid-token")
        .send({ message: "Hello", history: [] });

      // Should return 500 via error handler
      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
    });

    it("should handle low carbon score correctly in context", async () => {
      supabaseService.getLatestAssessment.mockResolvedValue({
        data: {
          id: "assessment-2",
          transport: 30,
          electricity: 500,
          diet: "vegan",
          flights: 0,
          shopping: 1,
          carbon_score: 50,
          created_at: new Date().toISOString(),
        },
        error: null,
      });

      generateCoachResponse.mockResolvedValue("You're doing great!");

      const res = await request(app)
        .post("/api/coach/chat")
        .set("Authorization", "Bearer valid-token")
        .send({ message: "How am I doing?", history: [] });

      expect(res.statusCode).toBe(200);

      // Verify "Low" level was passed
      expect(generateCoachResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          userContext: expect.objectContaining({
            carbonScore: 50,
            level: "Low",
          }),
        }),
      );
    });

    it("should handle high carbon score correctly in context", async () => {
      supabaseService.getLatestAssessment.mockResolvedValue({
        data: {
          id: "assessment-3",
          transport: 2000,
          electricity: 10000,
          diet: "non-veg",
          flights: 20,
          shopping: 50,
          carbon_score: 1000,
          created_at: new Date().toISOString(),
        },
        error: null,
      });

      generateCoachResponse.mockResolvedValue("Your footprint is high, but don't worry!");

      const res = await request(app)
        .post("/api/coach/chat")
        .set("Authorization", "Bearer valid-token")
        .send({ message: "I need help", history: [] });

      expect(res.statusCode).toBe(200);

      // Verify "High" level was passed
      expect(generateCoachResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          userContext: expect.objectContaining({
            carbonScore: 1000,
            level: "High",
          }),
        }),
      );
    });
  });
});

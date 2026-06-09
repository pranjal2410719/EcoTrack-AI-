const request = require("supertest");
const app = require("../src/server");

describe("AI Coach", () => {
  describe("POST /api/coach/chat (auth required)", () => {
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
  });
});

const request = require("supertest");
const app = require("../src/server");

describe("Dashboard", () => {
  describe("GET /api/dashboard (auth required)", () => {
    it("should return 401 without auth token", async () => {
      const res = await request(app).get("/api/dashboard");
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should return 401 with invalid Bearer token", async () => {
      const res = await request(app)
        .get("/api/dashboard")
        .set("Authorization", "Bearer invalid-token");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/dashboard error states", () => {
    it("should return 401 with expired-looking token", async () => {
      const res = await request(app)
        .get("/api/dashboard")
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjB9.abc");

      expect(res.statusCode).toBe(401);
    });
  });
});

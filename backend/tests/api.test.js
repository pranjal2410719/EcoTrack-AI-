const request = require("supertest");
const app = require("../src/server");

describe("API Routes", () => {
  describe("GET /api/health", () => {
    it("should return 200 with status ok", async () => {
      const res = await request(app).get("/api/health");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("success", true);
    });
  });

  describe("POST /api/calculate", () => {
    it("should return 200 and carbon score for valid input", async () => {
      const res = await request(app)
        .post("/api/calculate")
        .send({
          transport: 100,
          electricity: 2000,
          diet: "vegetarian",
          flights: 2,
          shopping: 5,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("total");
      expect(res.body.data).toHaveProperty("level");
      expect(res.body.data).toHaveProperty("breakdown");
      expect(res.body.data.total).toBeGreaterThan(0);
    });

    it("should return 400 for missing required fields", async () => {
      const res = await request(app)
        .post("/api/calculate")
        .send({ transport: 100 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 for invalid diet value", async () => {
      const res = await request(app)
        .post("/api/calculate")
        .send({
          transport: 100,
          electricity: 2000,
          diet: "paleo",
          flights: 2,
          shopping: 5,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 for negative flights", async () => {
      const res = await request(app)
        .post("/api/calculate")
        .send({
          transport: 100,
          electricity: 2000,
          diet: "vegan",
          flights: -1,
          shopping: 5,
        });

      expect(res.statusCode).toBe(400);
    });

    it("should return valid breakdown with all categories", async () => {
      const res = await request(app)
        .post("/api/calculate")
        .send({
          transport: 150,
          electricity: 3000,
          diet: "non-veg",
          flights: 4,
          shopping: 8,
        });

      expect(res.statusCode).toBe(200);
      const { breakdown } = res.body.data;
      expect(breakdown).toHaveProperty("transport");
      expect(breakdown).toHaveProperty("electricity");
      expect(breakdown).toHaveProperty("flights");
      expect(breakdown).toHaveProperty("shopping");
      expect(breakdown).toHaveProperty("diet");
    });
  });

  describe("POST /api/assessment (auth required)", () => {
    it("should return 401 without auth token", async () => {
      const res = await request(app)
        .post("/api/assessment")
        .send({
          transport: 100,
          electricity: 2000,
          diet: "vegan",
          flights: 1,
          shopping: 3,
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/dashboard (auth required)", () => {
    it("should return 401 without auth token", async () => {
      const res = await request(app).get("/api/dashboard");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/analyze (auth required)", () => {
    it("should return 401 without auth token", async () => {
      const res = await request(app)
        .post("/api/analyze")
        .send({ assessmentId: "test-id" });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("404 handling", () => {
    it("should return 404 for unknown routes", async () => {
      const res = await request(app).get("/api/nonexistent");
      expect(res.statusCode).toBe(404);
    });
  });
});

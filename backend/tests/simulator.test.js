const request = require("supertest");
const app = require("../src/server");
const { computeSavings } = require("../src/controllers/simulatorController");

describe("Carbon Reduction Simulator", () => {
  describe("computeSavings (unit)", () => {
    it("should compute zero savings when current and target are identical", () => {
      const input = { transport: 100, electricity: 2000, diet: "vegetarian", flights: 2, shopping: 5 };
      const result = computeSavings(input, input);

      expect(result.monthlyReduction).toBe(0);
      expect(result.annualReduction).toBe(0);
      expect(result.percentageReduction).toBe(0);
      expect(Object.keys(result.categorySavings).length).toBe(0);
    });

    it("should compute positive savings when target is lower impact", () => {
      const current = { transport: 200, electricity: 3000, diet: "non-veg", flights: 4, shopping: 8 };
      const target = { transport: 50, electricity: 1000, diet: "vegan", flights: 1, shopping: 2 };

      const result = computeSavings(current, target);

      expect(result.monthlyReduction).toBeGreaterThan(0);
      expect(result.annualReduction).toBeGreaterThan(0);
      expect(result.percentageReduction).toBeGreaterThan(0);
      expect(result.current.total).toBeGreaterThan(result.target.total);
      expect(result.current.level).not.toBe(result.target.level); // Should drop at least one level
    });

    it("should detect category-level savings", () => {
      const current = { transport: 200, electricity: 2000, diet: "non-veg", flights: 2, shopping: 5 };
      const target = { transport: 100, electricity: 2000, diet: "non-veg", flights: 2, shopping: 5 };

      const result = computeSavings(current, target);

      // Only transport should change
      expect(result.categorySavings).toHaveProperty("transport");
      expect(result.categorySavings.transport).toBeGreaterThan(0);
      // These unchanged categories shouldn't appear (diff <= 0.01)
      expect(result.categorySavings).not.toHaveProperty("electricity");
    });

    it("should compute negative savings when target is higher impact (user wants to see if they worsen)", () => {
      const current = { transport: 50, electricity: 1000, diet: "vegan", flights: 1, shopping: 2 };
      const target = { transport: 200, electricity: 3000, diet: "non-veg", flights: 4, shopping: 8 };

      const result = computeSavings(current, target);

      expect(result.monthlyReduction).toBeLessThan(0);
      expect(result.annualReduction).toBeLessThan(0);
      expect(result.current.total).toBeLessThan(result.target.total);
    });

    it("should return correct breakdown for both current and target", () => {
      const current = { transport: 150, electricity: 2500, diet: "vegetarian", flights: 3, shopping: 6 };
      const target = { transport: 75, electricity: 1500, diet: "vegan", flights: 1, shopping: 3 };

      const result = computeSavings(current, target);

      // Both should have all breakdown categories
      expect(result.current.breakdown).toHaveProperty("transport");
      expect(result.current.breakdown).toHaveProperty("electricity");
      expect(result.current.breakdown).toHaveProperty("diet");
      expect(result.current.breakdown).toHaveProperty("flights");
      expect(result.current.breakdown).toHaveProperty("shopping");
      expect(result.target.breakdown).toHaveProperty("transport");
      expect(result.target.breakdown).toHaveProperty("electricity");
      expect(result.target.breakdown).toHaveProperty("diet");
      expect(result.target.breakdown).toHaveProperty("flights");
      expect(result.target.breakdown).toHaveProperty("shopping");

      // Target should be lower than current
      expect(result.target.total).toBeLessThan(result.current.total);
    });

    it("should handle zero values in both current and target", () => {
      const current = { transport: 0, electricity: 0, diet: "vegan", flights: 0, shopping: 0 };
      const target = { transport: 0, electricity: 0, diet: "vegan", flights: 0, shopping: 0 };

      const result = computeSavings(current, target);

      expect(result.current.total).toBe(20); // Only diet
      expect(result.target.total).toBe(20);
      expect(result.monthlyReduction).toBe(0);
    });

    it("should compute percentage reduction correctly", () => {
      const current = { transport: 100, electricity: 2000, diet: "vegetarian", flights: 0, shopping: 0 };
      const target = { transport: 0, electricity: 0, diet: "vegan", flights: 0, shopping: 0 };

      const result = computeSavings(current, target);

      // Current: 21 + 1.6 + 0 + 0 + 50 = 72.6
      // Target: 0 + 0 + 20 + 0 + 0 = 20
      // Reduction: (72.6 - 20) / 72.6 * 100 ≈ 72.45%
      expect(result.percentageReduction).toBeGreaterThan(70);
      expect(result.percentageReduction).toBeLessThan(75);
    });

    it("should handle switching from high-impact to low-impact diet", () => {
      const current = { transport: 0, electricity: 0, diet: "non-veg", flights: 0, shopping: 0 };
      const target = { transport: 0, electricity: 0, diet: "vegan", flights: 0, shopping: 0 };

      const result = computeSavings(current, target);

      expect(result.categorySavings).toHaveProperty("diet");
      expect(result.categorySavings.diet).toBe(80); // 100 - 20
      expect(result.monthlyReduction).toBe(80);
    });
  });

  describe("POST /api/simulate (integration)", () => {
    it("should return 200 with valid savings data", async () => {
      const res = await request(app)
        .post("/api/simulate")
        .send({
          current: { transport: 200, electricity: 3000, diet: "non-veg", flights: 4, shopping: 8 },
          target: { transport: 50, electricity: 1000, diet: "vegan", flights: 1, shopping: 2 },
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("current");
      expect(res.body.data).toHaveProperty("target");
      expect(res.body.data).toHaveProperty("monthlyReduction");
      expect(res.body.data).toHaveProperty("annualReduction");
      expect(res.body.data).toHaveProperty("percentageReduction");
      expect(res.body.data).toHaveProperty("categorySavings");
      expect(res.body.data.monthlyReduction).toBeGreaterThan(0);
    });

    it("should return 400 when current is missing", async () => {
      const res = await request(app)
        .post("/api/simulate")
        .send({ target: { transport: 50 } });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 when target is missing", async () => {
      const res = await request(app)
        .post("/api/simulate")
        .send({ current: { transport: 100 } });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 when body is empty", async () => {
      const res = await request(app).post("/api/simulate").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should return 200 even without optional fields (default to 0)", async () => {
      const res = await request(app)
        .post("/api/simulate")
        .send({
          current: { transport: 100 },
          target: { transport: 50 },
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.monthlyReduction).toBe(10.5); // (100 - 50) * 0.21
    });

    it("should show level improvement when switching to vegan", async () => {
      const res = await request(app)
        .post("/api/simulate")
        .send({
          current: { transport: 0, electricity: 0, diet: "non-veg", flights: 0, shopping: 0 },
          target: { transport: 0, electricity: 0, diet: "vegan", flights: 0, shopping: 0 },
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.current.level).toBe("Low");
      expect(res.body.data.target.level).toBe("Low");
    });

    it("should handle large numbers without crashing", async () => {
      const res = await request(app)
        .post("/api/simulate")
        .send({
          current: { transport: 10000, electricity: 100000, diet: "non-veg", flights: 100, shopping: 500 },
          target: { transport: 0, electricity: 0, diet: "vegan", flights: 0, shopping: 0 },
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.annualReduction).toBeGreaterThan(10000);
    });
  });
});

const { calculateCarbonScore } = require("../src/services/carbonCalculator");

describe("Carbon Calculator", () => {
  describe("calculateCarbonScore", () => {
    it("should return a valid score object for typical input", () => {
      const result = calculateCarbonScore({
        transport: 100,
        electricity: 2000,
        flights: 2,
        shopping: 5,
        diet: "vegetarian",
      });

      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("level");
      expect(result).toHaveProperty("breakdown");
      expect(result.total).toBeGreaterThan(0);
      expect(typeof result.total).toBe("number");
    });

    it("should calculate vegetarian diet correctly", () => {
      const result = calculateCarbonScore({
        transport: 0,
        electricity: 0,
        flights: 0,
        shopping: 0,
        diet: "vegetarian",
      });
      expect(result.total).toBe(50); // Only dietScore
      expect(result.level).toBe("Low");
    });

    it("should calculate vegan diet correctly", () => {
      const result = calculateCarbonScore({
        transport: 0,
        electricity: 0,
        flights: 0,
        shopping: 0,
        diet: "vegan",
      });
      expect(result.total).toBe(20);
      expect(result.level).toBe("Low");
    });

    it("should calculate non-veg diet correctly", () => {
      const result = calculateCarbonScore({
        transport: 0,
        electricity: 0,
        flights: 0,
        shopping: 0,
        diet: "non-veg",
      });
      expect(result.total).toBe(100);
      expect(result.level).toBe("Low");
    });

    it("should default unknown diet to vegetarian-level", () => {
      const result = calculateCarbonScore({
        transport: 0,
        electricity: 0,
        flights: 0,
        shopping: 0,
        diet: "unknown",
      });
      expect(result.total).toBe(50);
    });

    it("should classify High level for scores >= 500", () => {
      const result = calculateCarbonScore({
        transport: 2000,
        electricity: 5000,
        flights: 10,
        shopping: 20,
        diet: "non-veg",
      });
      expect(result.level).toBe("High");
      expect(result.total).toBeGreaterThanOrEqual(500);
    });

    it("should classify Moderate level for scores between 200 and 500", () => {
      const result = calculateCarbonScore({
        transport: 500,
        electricity: 2000,
        flights: 2,
        shopping: 10,
        diet: "vegetarian",
      });
      expect(result.level).toBe("Moderate");
      expect(result.total).toBeGreaterThanOrEqual(200);
      expect(result.total).toBeLessThan(500);
    });

    it("should return breakdown with all categories", () => {
      const result = calculateCarbonScore({
        transport: 100,
        electricity: 2000,
        flights: 2,
        shopping: 5,
        diet: "vegetarian",
      });
      expect(result.breakdown).toHaveProperty("transport");
      expect(result.breakdown).toHaveProperty("electricity");
      expect(result.breakdown).toHaveProperty("flights");
      expect(result.breakdown).toHaveProperty("shopping");
      expect(result.breakdown).toHaveProperty("diet");
    });

    it("should handle zero values gracefully", () => {
      const result = calculateCarbonScore({
        transport: 0,
        electricity: 0,
        flights: 0,
        shopping: 0,
        diet: "vegan",
      });
      expect(result.total).toBe(20);
      expect(result.breakdown.transport).toBe(0);
      expect(result.breakdown.electricity).toBe(0);
      expect(result.breakdown.flights).toBe(0);
      expect(result.breakdown.shopping).toBe(0);
    });

    it("should handle undefined optional fields", () => {
      const result = calculateCarbonScore({
        transport: 100,
        electricity: 2000,
        diet: "vegetarian",
      });
      expect(result.total).toBeGreaterThan(0);
      expect(result.breakdown.flights).toBe(0);
      expect(result.breakdown.shopping).toBe(0);
    });

    it("should calculate transport score correctly (0.21 per km)", () => {
      const result = calculateCarbonScore({
        transport: 100,
        electricity: 0,
        flights: 0,
        shopping: 0,
        diet: "vegan",
      });
      expect(result.breakdown.transport).toBe(21);
    });

    it("should calculate flights score correctly (90 per flight)", () => {
      const result = calculateCarbonScore({
        transport: 0,
        electricity: 0,
        flights: 3,
        shopping: 0,
        diet: "vegan",
      });
      expect(result.breakdown.flights).toBe(270);
    });
  });
});

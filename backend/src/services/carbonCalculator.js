/**
 * Carbon Footprint Calculator
 * Calculates estimated carbon emissions based on user lifestyle inputs.
 *
 * @module services/carbonCalculator
 */

/**
 * Carbon level thresholds and their labels.
 */
const LEVEL_THRESHOLDS = {
  LOW: 200,
  MODERATE: 500,
};

/**
 * Emission factors for each category.
 * Used to convert user inputs to estimated CO₂ in kg/month.
 */
const EMISSION_FACTORS = {
  transport: 0.21,     // kg CO₂ per km/week
  electricity: 0.0008, // kg CO₂ per ₹ of monthly bill
  flights: 90,         // kg CO₂ per flight per year
  shopping: 5,         // kg CO₂ per purchase per month
  diet: {
    vegan: 20,
    vegetarian: 50,
    "non-veg": 100,
    default: 50,
  },
};

/**
 * @typedef {Object} AssessmentData
 * @property {number} [transport] - Weekly transport distance in km
 * @property {number} [electricity] - Monthly electricity bill in ₹
 * @property {string} [diet] - Diet type: "vegan", "vegetarian", "non-veg"
 * @property {number} [flights] - Number of flights per year
 * @property {number} [shopping] - Online purchases per month
 */

/**
 * @typedef {Object} CarbonResult
 * @property {number} total - Total carbon footprint in kg CO₂/month
 * @property {"Low"|"Moderate"|"High"} level - Carbon level classification
 * @property {Object} breakdown - Per-category breakdown
 * @property {number} breakdown.transport - Transport emissions
 * @property {number} breakdown.electricity - Electricity emissions
 * @property {number} breakdown.flights - Flight emissions
 * @property {number} breakdown.shopping - Shopping emissions
 * @property {number} breakdown.diet - Diet emissions
 */

/**
 * Determine carbon level based on total score.
 *
 * @param {number} total - Total carbon footprint score
 * @returns {"Low"|"Moderate"|"High"} Carbon level label
 */
function getLevel(total) {
  if (total < LEVEL_THRESHOLDS.LOW) return "Low";
  if (total < LEVEL_THRESHOLDS.MODERATE) return "Moderate";
  return "High";
}

/**
 * Calculate diet score based on diet type.
 *
 * @param {string} [diet] - Diet type
 * @returns {number} Diet carbon score in kg CO₂/month
 */
function getDietScore(diet) {
  const dietScores = EMISSION_FACTORS.diet;
  return dietScores[diet] ?? dietScores.default;
}

/**
 * Calculate category-level carbon score.
 *
 * @param {number} value - User input value
 * @param {number} factor - Emission factor multiplier
 * @returns {number} Calculated carbon score
 */
function calculateCategory(value, factor) {
  return (value || 0) * factor;
}

/**
 * Calculate the total carbon footprint score from user assessment data.
 *
 * Steps:
 * 1. Multiply each user input by its emission factor
 * 2. Sum all category scores for the total
 * 3. Classify the total into Low / Moderate / High
 *
 * @param {AssessmentData} data - User's lifestyle assessment inputs
 * @returns {CarbonResult} Calculated carbon footprint result with breakdown
 *
 * @example
 * const result = calculateCarbonScore({
 *   transport: 100,
 *   electricity: 2000,
 *   diet: "vegetarian",
 *   flights: 2,
 *   shopping: 5,
 * });
 * // => { total: 345.5, level: "Moderate", breakdown: { ... } }
 */
function calculateCarbonScore(data) {
  const { transport, electricity, diet, flights, shopping } = data;

  // Calculate individual category scores
  const transportScore = calculateCategory(transport, EMISSION_FACTORS.transport);
  const electricityScore = calculateCategory(electricity, EMISSION_FACTORS.electricity);
  const flightsScore = calculateCategory(flights, EMISSION_FACTORS.flights);
  const shoppingScore = calculateCategory(shopping, EMISSION_FACTORS.shopping);
  const dietScore = getDietScore(diet);

  const total = transportScore + electricityScore + flightsScore + shoppingScore + dietScore;

  const round = (val) => Math.round(val * 100) / 100;

  return {
    total: round(total),
    level: getLevel(total),
    breakdown: {
      transport: round(transportScore),
      electricity: round(electricityScore),
      flights: round(flightsScore),
      shopping: round(shoppingScore),
      diet: round(dietScore),
    },
  };
}

module.exports = { calculateCarbonScore, getLevel, EMISSION_FACTORS };

/**
 * Carbon Footprint Calculator
 * Calculates estimated carbon emissions based on user lifestyle inputs.
 */

function calculateCarbonScore(data) {
  const { transport, electricity, diet, flights, shopping } = data;

  // Category scores
  const transportScore = (transport || 0) * 0.21;
  const electricityScore = (electricity || 0) * 0.0008;
  const flightsScore = (flights || 0) * 90;
  const shoppingScore = (shopping || 0) * 5;

  // Diet score
  let dietScore = 0;
  switch (diet) {
    case "non-veg":
      dietScore = 100;
      break;
    case "vegetarian":
      dietScore = 50;
      break;
    case "vegan":
      dietScore = 20;
      break;
    default:
      dietScore = 50;
  }

  const total = transportScore + electricityScore + flightsScore + shoppingScore + dietScore;

  // Carbon level classification
  let level;
  if (total < 200) {
    level = "Low";
  } else if (total < 500) {
    level = "Moderate";
  } else {
    level = "High";
  }

  return {
    total: Math.round(total * 100) / 100,
    level,
    breakdown: {
      transport: Math.round(transportScore * 100) / 100,
      electricity: Math.round(electricityScore * 100) / 100,
      flights: Math.round(flightsScore * 100) / 100,
      shopping: Math.round(shoppingScore * 100) / 100,
      diet: Math.round(dietScore * 100) / 100,
    },
  };
}

module.exports = { calculateCarbonScore };

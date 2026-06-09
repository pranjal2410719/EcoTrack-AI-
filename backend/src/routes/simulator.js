const express = require("express");
const router = express.Router();
const { simulateReduction } = require("../controllers/simulatorController");

/**
 * POST /api/simulate
 * Compare current vs target lifestyle and calculate potential savings.
 * No auth required (can be used before user takes assessment).
 */
router.post("/", simulateReduction);

module.exports = router;

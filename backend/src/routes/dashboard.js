const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getDashboard } = require("../controllers/dashboardController");

/**
 * GET /api/dashboard
 * Fetch all dashboard data for the authenticated user.
 */
router.get("/", authenticate, getDashboard);

module.exports = router;

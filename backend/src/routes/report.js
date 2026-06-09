const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getReportData } = require("../controllers/reportController");

/**
 * GET /api/report
 * Get aggregated data for PDF Sustainability Report.
 * Requires authentication.
 */
router.get("/", authenticate, getReportData);

module.exports = router;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health");
const assessmentRoutes = require("./routes/assessment");
const calculateRoutes = require("./routes/calculate");
const aiRoutes = require("./routes/ai");
const dashboardRoutes = require("./routes/dashboard");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5001;

// Global CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/calculate", calculateRoutes);
app.use("/api/analyze", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler — must be after all route definitions
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Error handler
app.use(errorHandler);

// Start only when run directly (not when imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
      console.log(`EcoTrack AI backend running on port ${PORT}`);
  });
}

module.exports = app;

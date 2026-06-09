require("dotenv").config();
const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health");
const assessmentRoutes = require("./routes/assessment");
const calculateRoutes = require("./routes/calculate");
const aiRoutes = require("./routes/ai");
const dashboardRoutes = require("./routes/dashboard");
const coachRoutes = require("./routes/coach");
const simulatorRoutes = require("./routes/simulator");
const reportRoutes = require("./routes/report");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimit");

const app = express();
const PORT = process.env.PORT || 5001;

// Global CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "https://ecotrack0a.netlify.app",
  "https://ecotrack-ai-tdq4.onrender.com",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/calculate", calculateRoutes);
app.use("/api/analyze", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/simulate", simulatorRoutes);
app.use("/api/report", reportRoutes);

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

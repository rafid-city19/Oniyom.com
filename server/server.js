const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ========================================
// CORS
// ========================================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

// ========================================
// UPLOADED IMAGES
// ========================================

app.use(
  "/uploads",
  express.static("uploads")
);

// ========================================
// API ROUTES
// ========================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// ========================================
// API HOME
// ========================================

app.get("/", (req, res) => {
  res.json({
    message:
      "Oniyom API is running",
  });
});

// ========================================
// SERVER PORT
// ========================================

const PORT =
  process.env.PORT || 5000;

// ========================================
// START SERVER
// ========================================

const startServer = async () => {
  try {
    // Connect MongoDB first
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(
        `Oniyom server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );
  }
};

startServer();
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
    origin: "https://oniyom-nu.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
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
    success: true,
    message: "Oniyom API is running",
  });
});


// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});


// ========================================
// SERVER PORT
// ========================================

const PORT = process.env.PORT || 5000;


// ========================================
// START SERVER
// ========================================

const startServer = async () => {
  try {
    // Connect MongoDB first
    await connectDB();

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
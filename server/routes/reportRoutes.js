const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createReport,
  getReports,
  getReportById,
  getMyReports,
  updateMyReport,
  deleteMyReport,
} = require("../controllers/reportController");

// IMPORTANT:
// Change this import if your upload middleware
// has a different filename/path.

const upload = require("../middleware/uploadMiddleware");


// ========================================
// CREATE REPORT
// ========================================

router.post(
  "/",
  protect,
  upload.single("image"),
  createReport
);


// ========================================
// GET MY REPORTS
// ========================================

router.get(
  "/my-reports",
  protect,
  getMyReports
);


// ========================================
// UPDATE MY REPORT
// ========================================

router.put(
  "/my-reports/:id",
  protect,
  upload.single("image"),
  updateMyReport
);


// ========================================
// DELETE MY REPORT
// ========================================

router.delete(
  "/my-reports/:id",
  protect,
  deleteMyReport
);


// ========================================
// GET ALL REPORTS
// ========================================

router.get(
  "/",
  getReports
);


// ========================================
// GET SINGLE REPORT
// ========================================

router.get(
  "/:id",
  getReportById
);


module.exports = router;
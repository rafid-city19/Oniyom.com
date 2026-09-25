const express = require("express");

const {
  getAllReportsAdmin,
  updateReportStatus,
  deleteReportAdmin,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// ========================================
// ALL ADMIN ROUTES REQUIRE
// LOGIN + ADMIN ROLE
// ========================================

router.use(protect);
router.use(admin);

// ========================================
// ADMIN TEST
// ========================================

router.get(
  "/test",
  (req, res) => {
    res.json({
      message:
        "Admin access successful",

      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

// ========================================
// GET ALL REPORTS
// ========================================

router.get(
  "/reports",
  getAllReportsAdmin
);

// ========================================
// UPDATE REPORT STATUS
// ========================================

router.patch(
  "/reports/:id/status",
  updateReportStatus
);

// ========================================
// DELETE REPORT
// ========================================

router.delete(
  "/reports/:id",
  deleteReportAdmin
);

// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;
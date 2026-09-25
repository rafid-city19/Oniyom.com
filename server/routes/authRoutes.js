const express = require("express");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authTemp");

const router = express.Router();


// ========================================
// REGISTER
// ========================================

router.post(
  "/register",
  register
);


// ========================================
// LOGIN
// ========================================

router.post(
  "/login",
  login
);


// ========================================
// FORGOT PASSWORD
// ========================================

router.post(
  "/forgot-password",
  forgotPassword
);


// ========================================
// RESET PASSWORD
// ========================================

router.post(
  "/reset-password",
  resetPassword
);


module.exports = router;
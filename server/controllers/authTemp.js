const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");


// ========================================
// REGISTER
// ========================================

const register = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        message: "নাম, ফোন নম্বর এবং পাসওয়ার্ড দিন",
      });
    }

    const cleanPhone = phone.trim();

    if (password.length < 6) {
      return res.status(400).json({
        message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
      });
    }

    const existingUser = await User.findOne({
      phone: cleanPhone,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "এই ফোন নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name: name.trim(),
      phone: cleanPhone,
      password: hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে",

      token,

      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "সার্ভারে সমস্যা হয়েছে",
    });
  }
};


// ========================================
// LOGIN
// ========================================

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: "ফোন নম্বর এবং পাসওয়ার্ড দিন",
      });
    }

    const cleanPhone = phone.trim();

    const user = await User.findOne({
      phone: cleanPhone,
    });

    if (!user) {
      return res.status(401).json({
        message: "ফোন নম্বর অথবা পাসওয়ার্ড ভুল",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "ফোন নম্বর অথবা পাসওয়ার্ড ভুল",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "লগইন সফল হয়েছে",

      token,

      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "সার্ভারে সমস্যা হয়েছে",
    });
  }
};


// ========================================
// FORGOT PASSWORD
// ========================================

const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "আপনার ফোন নম্বর দিন",
      });
    }

    const cleanPhone = phone.trim();

    const user = await User.findOne({
      phone: cleanPhone,
    });

    // Security:
    // Don't reveal whether the phone number exists.
    if (!user) {
      return res.json({
        message:
          "যদি এই ফোন নম্বরে অ্যাকাউন্ট থাকে, তাহলে OTP পাঠানো হবে",
      });
    }

    // Generate 6 digit OTP
    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    user.resetPasswordOTP = otp;

    // OTP valid for 10 minutes
    user.resetPasswordOTPExpires =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    // Development only
    // Later we'll replace this with real SMS sending.
    console.log("========================================");
    console.log("PASSWORD RESET OTP:");
    console.log(otp);
    console.log("PHONE:");
    console.log(cleanPhone);
    console.log("========================================");

    res.json({
      message:
        "যদি এই ফোন নম্বরে অ্যাকাউন্ট থাকে, তাহলে OTP পাঠানো হবে",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      message: "সার্ভারে সমস্যা হয়েছে",
    });
  }
};


// ========================================
// RESET PASSWORD
// ========================================

const resetPassword = async (req, res) => {
  try {
    const { phone, otp, password } = req.body;

    if (!phone || !otp || !password) {
      return res.status(400).json({
        message:
          "ফোন নম্বর, OTP এবং নতুন পাসওয়ার্ড দিন",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
      });
    }

    const cleanPhone = phone.trim();

    const user = await User.findOne({
      phone: cleanPhone,

      resetPasswordOTP: otp,

      resetPasswordOTPExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "OTP ভুল অথবা মেয়াদ শেষ হয়ে গেছে",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    user.password = hashedPassword;

    // Clear OTP after successful reset
    user.resetPasswordOTP = null;

    user.resetPasswordOTPExpires = null;

    await user.save();

    res.json({
      message:
        "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    res.status(500).json({
      message: "সার্ভারে সমস্যা হয়েছে",
    });
  }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
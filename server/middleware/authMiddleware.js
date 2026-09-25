const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;


    // Check Authorization header

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message:
          "অনুমতি নেই, আগে লগইন করুন",
      });
    }


    // Get token

    const token =
      authHeader.split(" ")[1];


    // Verify token

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // Find user

    const user =
      await User.findById(
        decoded.id
      ).select("-password");


    // User not found

    if (!user) {
      return res.status(401).json({
        message:
          "ইউজার পাওয়া যায়নি",
      });
    }


    // Attach user to request

    req.user = user;


    // Continue

    next();

  } catch (error) {

    console.error(
      "Auth middleware error:",
      error
    );

    return res.status(401).json({
      message:
        "অবৈধ বা মেয়াদ শেষ হওয়া token",
    });
  }
};

module.exports = protect;
const admin = (req, res, next) => {
  // User login করা আছে কি না
  if (!req.user) {
    return res.status(401).json({
      message: "অনুমতি নেই",
    });
  }

  // User admin কি না
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message:
        "শুধুমাত্র admin এই কাজটি করতে পারবেন",
    });
  }

  // Admin হলে পরের middleware/controller-এ যাবে
  next();
};

module.exports = admin;
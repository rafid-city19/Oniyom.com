const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Report = require("../models/Report");


// ========================================
// DELETE IMAGE FILE
// ========================================

const deleteImageFile = (imagePath) => {
  if (!imagePath) {
    return;
  }

  try {
    const fileName = path.basename(
      imagePath
    );

    const fullPath = path.join(
      __dirname,
      "..",
      "uploads",
      fileName
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);

      console.log(
        "Deleted image:",
        fileName
      );
    }
  } catch (error) {
    console.error(
      "Admin image delete error:",
      error
    );
  }
};


// ========================================
// GET ALL REPORTS — ADMIN
// ========================================

const getAllReportsAdmin = async (
  req,
  res
) => {
  try {
    const reports =
      await Report.find()
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      reports,
    });
  } catch (error) {
    console.error(
      "Admin get reports error:",
      error
    );

    res.status(500).json({
      message:
        "রিপোর্টগুলো পাওয়া যায়নি",
    });
  }
};


// ========================================
// UPDATE REPORT STATUS — ADMIN
// ========================================

const updateReportStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message:
          "অবৈধ রিপোর্ট ID",
      });
    }

    const allowedStatuses = [
      "pending",
      "reviewing",
      "resolved",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message:
          "অবৈধ status",
      });
    }

    const report =
      await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        message:
          "রিপোর্ট পাওয়া যায়নি",
      });
    }

    report.status = status;

    await report.save();

    await report.populate(
      "user",
      "name email"
    );

    res.status(200).json({
      message:
        "রিপোর্টের status সফলভাবে আপডেট হয়েছে",

      report,
    });
  } catch (error) {
    console.error(
      "Admin update status error:",
      error
    );

    res.status(500).json({
      message:
        "রিপোর্টের status আপডেট করা যায়নি",
    });
  }
};


// ========================================
// DELETE REPORT — ADMIN
// ========================================

const deleteReportAdmin = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message:
          "অবৈধ রিপোর্ট ID",
      });
    }

    const report =
      await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        message:
          "রিপোর্ট পাওয়া যায়নি",
      });
    }

    // Save image path

    const imagePath =
      report.image;

    // Delete database document

    await Report.findByIdAndDelete(id);

    // Delete physical image

    deleteImageFile(imagePath);

    res.status(200).json({
      message:
        "রিপোর্ট সফলভাবে মুছে ফেলা হয়েছে",
    });
  } catch (error) {
    console.error(
      "Admin delete report error:",
      error
    );

    res.status(500).json({
      message:
        "রিপোর্ট মুছতে সমস্যা হয়েছে",
    });
  }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
  getAllReportsAdmin,
  updateReportStatus,
  deleteReportAdmin,
};
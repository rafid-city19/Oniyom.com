const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Report = require("../models/Report");

// ========================================
// DELETE UPLOADED IMAGE FILE
// ========================================

const deleteImageFile = (imagePath) => {
  if (!imagePath) {
    return;
  }

  try {
    const fileName = path.basename(imagePath);

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
      "Image delete error:",
      error
    );
  }
};

// ========================================
// PARSE LOCATION
// ========================================

const parseLocation = (location) => {
  if (!location) {
    return {
      address: "",
      latitude: null,
      longitude: null,
    };
  }

  // FormData sends location as a string
  if (typeof location === "string") {
    try {
      return JSON.parse(location);
    } catch (error) {
      console.error(
        "Location JSON parse error:",
        error
      );

      return {
        address: location,
        latitude: null,
        longitude: null,
      };
    }
  }

  return location;
};

// ========================================
// CREATE REPORT
// ========================================

const createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
    } = req.body;

    if (
      !title ||
      !description ||
      !category
    ) {
      return res.status(400).json({
        message:
          "Title, description এবং category প্রয়োজন",
      });
    }

    const parsedLocation =
      parseLocation(location);

    const report =
      await Report.create({
        title,
        description,
        category,

        location: {
          address:
            parsedLocation.address || "",

          latitude:
            parsedLocation.latitude !==
              undefined &&
            parsedLocation.latitude !==
              null &&
            parsedLocation.latitude !== ""
              ? Number(
                  parsedLocation.latitude
                )
              : null,

          longitude:
            parsedLocation.longitude !==
              undefined &&
            parsedLocation.longitude !==
              null &&
            parsedLocation.longitude !== ""
              ? Number(
                  parsedLocation.longitude
                )
              : null,
        },

        user: req.user._id,

        status: "pending",

        image: req.file
          ? `/uploads/${req.file.filename}`
          : "",
      });

    await report.populate(
      "user",
      "name email"
    );

    res.status(201).json({
      message:
        "রিপোর্ট সফলভাবে তৈরি হয়েছে",

      report,
    });
  } catch (error) {
    console.error(
      "Create report error:",
      error
    );

    res.status(500).json({
      message:
        "রিপোর্ট তৈরি করতে সমস্যা হয়েছে",
    });
  }
};

// ========================================
// GET ALL REPORTS
// ========================================

const getReports = async (req, res) => {
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
      "Get reports error:",
      error
    );

    res.status(500).json({
      message:
        "রিপোর্টগুলো পাওয়া যায়নি",
    });
  }
};

// ========================================
// GET SINGLE REPORT
// ========================================

const getReportById = async (
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
      await Report.findById(id)
        .populate(
          "user",
          "name email"
        );

    if (!report) {
      return res.status(404).json({
        message:
          "রিপোর্ট পাওয়া যায়নি",
      });
    }

    res.status(200).json({
      report,
    });
  } catch (error) {
    console.error(
      "Get report by ID error:",
      error
    );

    res.status(500).json({
      message:
        "রিপোর্ট পাওয়া যায়নি",
    });
  }
};

// ========================================
// GET MY REPORTS
// ========================================

const getMyReports = async (
  req,
  res
) => {
  try {
    const reports =
      await Report.find({
        user: req.user._id,
      })
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
      "Get my reports error:",
      error
    );

    res.status(500).json({
      message:
        "আপনার রিপোর্টগুলো পাওয়া যায়নি",
    });
  }
};

// ========================================
// UPDATE MY REPORT
// ========================================

const updateMyReport = async (
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
      await Report.findOne({
        _id: id,
        user: req.user._id,
      });

    if (!report) {
      return res.status(404).json({
        message:
          "রিপোর্ট পাওয়া যায়নি অথবা এটি আপনার রিপোর্ট নয়",
      });
    }

    const {
      title,
      description,
      category,
      location,
    } = req.body;

    // ------------------------------------
    // UPDATE BASIC INFORMATION
    // ------------------------------------

    if (title !== undefined) {
      report.title = title;
    }

    if (description !== undefined) {
      report.description =
        description;
    }

    if (category !== undefined) {
      report.category = category;
    }

    // ------------------------------------
    // UPDATE LOCATION
    // ------------------------------------

    if (location !== undefined) {
      const parsedLocation =
        parseLocation(location);

      report.location = {
        address:
          parsedLocation.address || "",

        latitude:
          parsedLocation.latitude !==
            undefined &&
          parsedLocation.latitude !==
            null &&
          parsedLocation.latitude !== ""
            ? Number(
                parsedLocation.latitude
              )
            : null,

        longitude:
          parsedLocation.longitude !==
            undefined &&
          parsedLocation.longitude !==
            null &&
          parsedLocation.longitude !== ""
            ? Number(
                parsedLocation.longitude
              )
            : null,
      };
    }

    // ------------------------------------
    // IMAGE REPLACEMENT
    // ------------------------------------

    const oldImage =
      report.image;

    if (req.file) {
      report.image =
        `/uploads/${req.file.filename}`;
    }

    // ------------------------------------
    // SAVE REPORT FIRST
    // ------------------------------------

    await report.save();

    // ------------------------------------
    // DELETE OLD IMAGE AFTER SAVE
    // ------------------------------------

    if (req.file && oldImage) {
      deleteImageFile(oldImage);
    }

    await report.populate(
      "user",
      "name email"
    );

    res.status(200).json({
      message:
        "রিপোর্ট সফলভাবে আপডেট হয়েছে",

      report,
    });
  } catch (error) {
    console.error(
      "Update report error:",
      error
    );

    res.status(500).json({
      message:
        "রিপোর্ট আপডেট করতে সমস্যা হয়েছে",
    });
  }
};

// ========================================
// DELETE MY REPORT
// ========================================

const deleteMyReport = async (
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
      await Report.findOne({
        _id: id,
        user: req.user._id,
      });

    if (!report) {
      return res.status(404).json({
        message:
          "রিপোর্ট পাওয়া যায়নি অথবা এটি আপনার রিপোর্ট নয়",
      });
    }

    const imagePath =
      report.image;

    await Report.findByIdAndDelete(id);

    deleteImageFile(imagePath);

    res.status(200).json({
      message:
        "রিপোর্ট সফলভাবে মুছে ফেলা হয়েছে",
    });
  } catch (error) {
    console.error(
      "Delete report error:",
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
  createReport,
  getReports,
  getReportById,
  getMyReports,
  updateMyReport,
  deleteMyReport,
};
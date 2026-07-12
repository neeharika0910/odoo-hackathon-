const Driver = require("../models/Driver");

// ================= GET ALL =================

exports.getDrivers = async (req, res) => {
  try {

    const drivers = await Driver.find().sort({
      createdAt: -1,
    });

    res.json(drivers);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

// ================= GET ONE =================

exports.getDriver = async (req, res) => {

  try {

    const driver = await Driver.findById(req.params.id);

    if (!driver)
      return res.status(404).json({
        message: "Driver not found",
      });

    res.json(driver);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

// ================= CREATE =================

exports.createDriver = async (req, res) => {

  try {

    const exists = await Driver.findOne({
      licenseNumber: req.body.licenseNumber,
    });

    if (exists)
      return res.status(400).json({
        message: "License number already exists",
      });

    const driver = await Driver.create(req.body);

    res.status(201).json(driver);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= UPDATE =================

exports.updateDriver = async (req, res) => {

  try {

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!driver)
      return res.status(404).json({
        message: "Driver not found",
      });

    res.json(driver);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= DELETE =================

exports.deleteDriver = async (req, res) => {

  try {

    const driver = await Driver.findByIdAndDelete(
      req.params.id
    );

    if (!driver)
      return res.status(404).json({
        message: "Driver not found",
      });

    res.json({
      message: "Driver deleted successfully",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= AVAILABLE DRIVERS =================

exports.getAvailableDrivers = async (req, res) => {

  try {

    const drivers = await Driver.find({
      status: "available",
      licenseExpiry: {
        $gte: new Date(),
      },
    });

    res.json(drivers);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};
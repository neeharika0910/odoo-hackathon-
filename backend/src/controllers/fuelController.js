const FuelLog = require("../models/FuelLog");

// ================= GET ALL =================
exports.getFuelLogs = async (req, res) => {
  try {
    const logs = await FuelLog.find()
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= CREATE =================
exports.createFuelLog = async (req, res) => {
  try {
    const log = await FuelLog.create(req.body);

    res.status(201).json(log);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= DELETE =================
exports.deleteFuelLog = async (req, res) => {
  try {
    await FuelLog.findByIdAndDelete(req.params.id);

    res.json({
      message: "Fuel log deleted",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
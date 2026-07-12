const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");

// ================= GET ALL =================
exports.getMaintenances = async (req, res) => {
  try {
    const records = await Maintenance.find()
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ONE =================
exports.getMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id)
      .populate("vehicle");

    if (!record)
      return res.status(404).json({
        message: "Maintenance record not found",
      });

    res.json(record);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= CREATE =================
exports.createMaintenance = async (req, res) => {
  try {
    const {
      vehicle,
      title,
      description,
      cost,
    } = req.body;

    const selectedVehicle = await Vehicle.findById(vehicle);

    if (!selectedVehicle)
      return res.status(404).json({
        message: "Vehicle not found",
      });

    if (
      selectedVehicle.status === "retired"
    ) {
      return res.status(400).json({
        message: "Retired vehicle cannot be maintained",
      });
    }

    const record = await Maintenance.create({
      vehicle,
      title,
      description,
      cost,
      status: "Active",
    });

    selectedVehicle.status = "maintenance";
    await selectedVehicle.save();

    res.status(201).json(record);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= COMPLETE =================
exports.completeMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id);

    if (!record)
      return res.status(404).json({
        message: "Record not found",
      });

    record.status = "Completed";
    record.completedDate = new Date();

    await record.save();

    const vehicle = await Vehicle.findById(record.vehicle);

    if (
      vehicle &&
      vehicle.status !== "retired"
    ) {
      vehicle.status = "available";
      await vehicle.save();
    }

    res.json({
      message: "Maintenance completed successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ================= DELETE =================
exports.deleteMaintenance = async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id);

    if (!record)
      return res.status(404).json({
        message: "Record not found",
      });

    await Maintenance.findByIdAndDelete(req.params.id);

    res.json({
      message: "Maintenance record deleted",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
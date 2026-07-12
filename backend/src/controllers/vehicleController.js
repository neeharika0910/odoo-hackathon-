const Vehicle = require("../models/Vehicle");

// Get All Vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();

    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Add Vehicle
exports.addVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);

    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get One Vehicle
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Update Vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(vehicle);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Delete Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({
      message: "Vehicle Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
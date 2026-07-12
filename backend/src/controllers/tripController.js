const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");

// =============================
// GET ALL TRIPS
// =============================
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate("vehicle")
      .populate("driver")
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// GET SINGLE TRIP
// =============================
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("vehicle")
      .populate("driver");

    if (!trip)
      return res.status(404).json({
        message: "Trip not found",
      });

    res.json(trip);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =============================
// CREATE TRIP
// =============================
exports.createTrip = async (req, res) => {
  try {
    const {
      source,
      destination,
      vehicle,
      driver,
      cargoWeight,
      plannedDistance,
    } = req.body;

    const selectedVehicle = await Vehicle.findById(vehicle);

    if (!selectedVehicle)
      return res.status(404).json({
        message: "Vehicle not found",
      });

    if (
      selectedVehicle.status === "maintenance" ||
      selectedVehicle.status === "retired"
    ) {
      return res.status(400).json({
        message: "Vehicle unavailable",
      });
    }

    if (selectedVehicle.status === "on_trip") {
      return res.status(400).json({
        message: "Vehicle already on trip",
      });
    }

    if (cargoWeight > selectedVehicle.capacityKg) {
      return res.status(400).json({
        message: "Cargo exceeds vehicle capacity",
      });
    }

    const selectedDriver = await Driver.findById(driver);

    if (!selectedDriver)
      return res.status(404).json({
        message: "Driver not found",
      });

    if (selectedDriver.status !== "available") {
      return res.status(400).json({
        message: "Driver unavailable",
      });
    }

    if (
      new Date(selectedDriver.licenseExpiry) <
      new Date()
    ) {
      return res.status(400).json({
        message: "Driver license expired",
      });
    }

    const trip = await Trip.create({
      source,
      destination,
      vehicle,
      driver,
      cargoWeight,
      plannedDistance,
      status: "Draft",
    });

    res.status(201).json(trip);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// =============================
// DISPATCH TRIP
// =============================
exports.dispatchTrip = async (req, res) => {

  try {

    const trip = await Trip.findById(req.params.id);

    if (!trip)
      return res.status(404).json({
        message: "Trip not found",
      });

    trip.status = "Dispatched";

    await trip.save();

    await Vehicle.findByIdAndUpdate(
      trip.vehicle,
      {
        status: "on_trip",
      }
    );

    await Driver.findByIdAndUpdate(
      trip.driver,
      {
        status: "on_trip",
      }
    );

    res.json({
      message: "Trip dispatched",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }

};

// =============================
// COMPLETE TRIP
// =============================
exports.completeTrip = async (req, res) => {

  try {

    const {
      actualDistance,
      fuelConsumed,
      revenue,
    } = req.body;

    const trip = await Trip.findById(req.params.id);

    if (!trip)
      return res.status(404).json({
        message: "Trip not found",
      });

    trip.actualDistance = actualDistance;
    trip.fuelConsumed = fuelConsumed;
    trip.revenue = revenue;

    trip.status = "Completed";

    await trip.save();

    await Vehicle.findByIdAndUpdate(
      trip.vehicle,
      {
        status: "available",
      }
    );

    await Driver.findByIdAndUpdate(
      trip.driver,
      {
        status: "available",
      }
    );

    res.json({
      message: "Trip completed",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// =============================
// CANCEL TRIP
// =============================
exports.cancelTrip = async (req, res) => {

  try {

    const trip = await Trip.findById(req.params.id);

    if (!trip)
      return res.status(404).json({
        message: "Trip not found",
      });

    trip.status = "Cancelled";

    await trip.save();

    await Vehicle.findByIdAndUpdate(
      trip.vehicle,
      {
        status: "available",
      }
    );

    await Driver.findByIdAndUpdate(
      trip.driver,
      {
        status: "available",
      }
    );

    res.json({
      message: "Trip cancelled",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};
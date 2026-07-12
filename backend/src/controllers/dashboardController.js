const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const Maintenance = require("../models/Maintenance");
const FuelLog = require("../models/FuelLog");
const Expense = require("../models/Expense");

exports.getDashboard = async (req, res) => {
  try {

    // ===========================
    // VEHICLES
    // ===========================

    const totalVehicles = await Vehicle.countDocuments();

    const availableVehicles = await Vehicle.countDocuments({
      status: "available",
    });

    const activeVehicles = await Vehicle.countDocuments({
      status: "on_trip",
    });

    const maintenanceVehicles = await Vehicle.countDocuments({
      status: "maintenance",
    });

    const retiredVehicles = await Vehicle.countDocuments({
      status: "retired",
    });

    // ===========================
    // DRIVERS
    // ===========================

    const totalDrivers = await Driver.countDocuments();

    const availableDrivers = await Driver.countDocuments({
      status: "available",
    });

    const onDutyDrivers = await Driver.countDocuments({
      status: "on_trip",
    });

    const suspendedDrivers = await Driver.countDocuments({
      status: "suspended",
    });

    // ===========================
    // TRIPS
    // ===========================

    const activeTrips = await Trip.countDocuments({
      status: "Dispatched",
    });

    const pendingTrips = await Trip.countDocuments({
      status: "Draft",
    });

    const completedTrips = await Trip.countDocuments({
      status: "Completed",
    });

    const cancelledTrips = await Trip.countDocuments({
      status: "Cancelled",
    });

    // ===========================
    // FUEL
    // ===========================

    const fuelSummary = await FuelLog.aggregate([
      {
        $group: {
          _id: null,
          totalFuelCost: {
            $sum: "$cost",
          },
          totalFuelLiters: {
            $sum: "$liters",
          },
        },
      },
    ]);

    // ===========================
    // EXPENSES
    // ===========================

    const expenseSummary = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalExpense: {
            $sum: "$amount",
          },
        },
      },
    ]);

    // ===========================
    // MAINTENANCE COST
    // ===========================

    const maintenanceSummary = await Maintenance.aggregate([
      {
        $group: {
          _id: null,
          totalMaintenance: {
            $sum: "$cost",
          },
        },
      },
    ]);

    // ===========================
    // TRIP DISTANCE
    // ===========================

    const tripDistance = await Trip.aggregate([
      {
        $group: {
          _id: null,
          totalDistance: {
            $sum: "$actualDistance",
          },
        },
      },
    ]);

    // ===========================
    // RECENT TRIPS
    // ===========================

    const recentTrips = await Trip.find()
      .populate("vehicle", "name registration")
      .populate("driver", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // ===========================
    // RECENT MAINTENANCE
    // ===========================

    const recentMaintenance = await Maintenance.find()
      .populate("vehicle", "name registration")
      .sort({ createdAt: -1 })
      .limit(5);

    // ===========================
    // CALCULATIONS
    // ===========================

    const totalFuelCost =
      fuelSummary.length > 0
        ? fuelSummary[0].totalFuelCost
        : 0;

    const totalFuelLiters =
      fuelSummary.length > 0
        ? fuelSummary[0].totalFuelLiters
        : 0;

    const totalExpense =
      expenseSummary.length > 0
        ? expenseSummary[0].totalExpense
        : 0;

    const maintenanceCost =
      maintenanceSummary.length > 0
        ? maintenanceSummary[0].totalMaintenance
        : 0;

    const totalDistance =
      tripDistance.length > 0
        ? tripDistance[0].totalDistance
        : 0;

    const operationalCost =
      totalFuelCost +
      totalExpense +
      maintenanceCost;

    const fleetUtilization =
      totalVehicles === 0
        ? 0
        : Number(
            (
              (activeVehicles / totalVehicles) *
              100
            ).toFixed(2)
          );

    const fuelEfficiency =
      totalFuelLiters === 0
        ? 0
        : Number(
            (
              totalDistance /
              totalFuelLiters
            ).toFixed(2)
          );

    // ===========================
    // RESPONSE
    // ===========================

    res.status(200).json({

      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        active: activeVehicles,
        maintenance: maintenanceVehicles,
        retired: retiredVehicles,
      },

      drivers: {
        total: totalDrivers,
        available: availableDrivers,
        onDuty: onDutyDrivers,
        suspended: suspendedDrivers,
      },

      trips: {
        active: activeTrips,
        pending: pendingTrips,
        completed: completedTrips,
        cancelled: cancelledTrips,
      },

      analytics: {
        fleetUtilization,
        fuelEfficiency,
        totalFuelLiters,
        totalDistance,
      },

      costs: {
        fuel: totalFuelCost,
        maintenance: maintenanceCost,
        expenses: totalExpense,
        operational: operationalCost,
      },

      recentTrips,

      recentMaintenance,

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};
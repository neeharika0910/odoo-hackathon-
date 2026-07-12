const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const Trip = require("../models/Trip");
const Maintenance = require("../models/Maintenance");
const Expense = require("../models/Expense");

exports.getDashboard = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const drivers = await Driver.find();
    const trips = await Trip.find();
    const maintenance = await Maintenance.find();
    const expenses = await Expense.find();

    const activeVehicles = vehicles.filter(
      (v) => v.status === "active"
    ).length;

    const availableVehicles = vehicles.filter(
      (v) => v.status === "available"
    ).length;

    const maintenanceVehicles = vehicles.filter(
      (v) => v.status === "maintenance"
    ).length;

    const activeTrips = trips.filter(
      (t) => t.status === "active"
    ).length;

    const pendingTrips = trips.filter(
      (t) => t.status === "pending"
    ).length;

    const onDutyDrivers = drivers.filter(
      (d) => d.status === "on-duty"
    ).length;

    const totalRevenue = trips.reduce(
      (sum, trip) => sum + (trip.revenue || 0),
      0
    );

    const utilization =
      vehicles.length === 0
        ? 0
        : Math.round(
            ((activeVehicles + maintenanceVehicles) /
              vehicles.length) *
              100
          );

    res.json({
      stats: {
        totalVehicles: vehicles.length,
        activeVehicles,
        availableVehicles,
        maintenanceVehicles,
        totalDrivers: drivers.length,
        onDutyDrivers,
        activeTrips,
        pendingTrips,
        utilization,
        revenue: totalRevenue,
      },

      recentTrips: trips.slice(-6).reverse(),

      recentMaintenance: maintenance.slice(-6).reverse(),

      recentExpenses: expenses.slice(-6).reverse(),
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Dashboard Error",
    });
  }
};
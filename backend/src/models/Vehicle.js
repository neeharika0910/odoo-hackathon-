const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    registration: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
    },
    fuelType: {
      type: String,
      default: "Diesel",
    },
    year: {
      type: Number,
      required: true,
    },
    capacityKg: {
      type: Number,
      required: true,
    },
    odometerKm: {
      type: Number,
      default: 0,
    },
    acquisitionCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "active", "maintenance", "inactive"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
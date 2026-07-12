const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    source: String,

    destination: String,

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },

    cargoWeight: Number,

    plannedDistance: Number,

    actualDistance: Number,

    fuelConsumed: Number,

    revenue: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "Dispatched",
        "Completed",
        "Cancelled",
      ],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);
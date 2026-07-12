const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    licenseCategory: {
      type: String,
      required: true,
    },

    licenseExpiry: {
      type: Date,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    safetyScore: {
      type: Number,
      default: 100,
    },

    status: {
      type: String,
      enum: [
        "available",
        "on_trip",
        "off_duty",
        "suspended",
      ],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Driver", driverSchema);
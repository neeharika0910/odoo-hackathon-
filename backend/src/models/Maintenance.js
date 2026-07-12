const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },

    title: String,

    description: String,

    cost: Number,

    status: {
      type: String,
      enum: [
        "Active",
        "Completed",
      ],
      default: "Active",
    },

    completedDate: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Maintenance",
  maintenanceSchema
);
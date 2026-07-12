const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },

    category: {
      type: String,
      enum: [
        "Fuel",
        "Maintenance",
        "Toll",
        "Insurance",
        "Other",
      ],
    },

    amount: Number,

    description: String,

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Expense",
  expenseSchema
);
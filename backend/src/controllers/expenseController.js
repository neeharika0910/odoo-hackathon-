const Expense = require("../models/Expense");

// ================= GET =================
exports.getExpenses = async (req, res) => {

  try {

    const expenses = await Expense.find()
      .populate("vehicle")
      .sort({ createdAt: -1 });

    res.json(expenses);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= CREATE =================
exports.createExpense = async (req, res) => {

  try {

    const expense = await Expense.create(req.body);

    res.status(201).json(expense);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= DELETE =================
exports.deleteExpense = async (req, res) => {

  try {

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      message: "Expense deleted",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};
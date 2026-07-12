const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getFuelLogs,
  createFuelLog,
  deleteFuelLog,
} = require("../controllers/fuelController");

router.get("/", auth, getFuelLogs);

router.post("/", auth, createFuelLog);

router.delete("/:id", auth, deleteFuelLog);

module.exports = router;
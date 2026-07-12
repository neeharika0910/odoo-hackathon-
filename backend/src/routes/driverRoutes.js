const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
  getAvailableDrivers,
} = require("../controllers/driverController");

router.get("/", auth, getDrivers);

router.get("/available", auth, getAvailableDrivers);

router.get("/:id", auth, getDriver);

router.post("/", auth, createDriver);

router.put("/:id", auth, updateDriver);

router.delete("/:id", auth, deleteDriver);

module.exports = router;
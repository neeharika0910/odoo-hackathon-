const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getMaintenances,
  getMaintenance,
  createMaintenance,
  completeMaintenance,
  deleteMaintenance,
} = require("../controllers/maintenanceController");

router.get("/", auth, getMaintenances);

router.get("/:id", auth, getMaintenance);

router.post("/", auth, createMaintenance);

router.put("/complete/:id", auth, completeMaintenance);

router.delete("/:id", auth, deleteMaintenance);

module.exports = router;
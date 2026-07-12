const express = require("express");

const router = express.Router();

const {
  getVehicles,
  addVehicle,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

const auth = require("../middleware/authMiddleware");

router.get("/", auth, getVehicles);

router.post("/", auth, addVehicle);

router.get("/:id", auth, getVehicle);

router.put("/:id", auth, updateVehicle);

router.delete("/:id", auth, deleteVehicle);

module.exports = router;
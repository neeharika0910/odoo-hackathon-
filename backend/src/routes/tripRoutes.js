const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getTrips,
  getTrip,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
} = require("../controllers/tripController");

router.get("/", auth, getTrips);

router.get("/:id", auth, getTrip);

router.post("/", auth, createTrip);

router.put("/dispatch/:id", auth, dispatchTrip);

router.put("/complete/:id", auth, completeTrip);

router.put("/cancel/:id", auth, cancelTrip);

module.exports = router;
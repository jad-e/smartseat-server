const express = require("express");

const {
  createReservation,
  getReservations,
  getReservation,
  deleteReservation,
  updateReservation,
} = require("../controllers/reservationController");

const router = express.Router();

//get all reservations
router.get("/", getReservations);

//get a single reservation
router.get("/:id", getReservation);

//post a new reservation
router.post("/", createReservation);

//delete a reservation
router.delete("/:id", deleteReservation);

//update a reservation
router.patch("/:id", updateReservation);

module.exports = router;

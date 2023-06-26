const Reservation = require("../models/reservationModel");
const mongoose = require("mongoose");

//get all reservations
const getReservations = async (req, res) => {
  const reservations = await Reservation.find();

  res.status(200).json(reservations);
};

//get a single reservation
const getReservation = async (req, res) => {
  const { id } = req.params;

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid reservation ID." });
  }

  //find the reservation
  const reservation = await Reservation.findById(id);

  if (!reservation) {
    return res.status(404).json({ error: "No such reservation found." });
  }

  res.status(200).json(reservation);
};

//post a new reservation
const createReservation = async (req, res) => {
  const { username, name, timeStart, timeEnd, date, venue, seat } = req.body; //extract the data that comes with the request

  //add doc to db
  try {
    //create a new reservation
    const reservation = await Reservation.create({
      username,
      name,
      timeStart,
      timeEnd,
      date,
      venue,
      seat,
    });
    res.status(200).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete a reservation
const deleteReservation = async (req, res) => {
  const { id } = req.params;
  const { ids } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid reservation ID." });
  }

  const reservation = await Reservation.deleteMany({ _id: { $in: ids } }); //will return the document that is deleted

  if (!reservation) {
    return res.status(404).json({ error: "No such reservation(s) found." });
  }

  //res.status(200).json(admin); //return the deleted workout

  const reservations = await Reservation.find();

  res.status(200).json(reservations);
};

//update a reservation
const updateReservation = async (req, res) => {
  const { username } = req.params;
  const { timeEnd } = req.body; //extract the data that comes with the request

  //find and update the wanted reservation
  const reservation = await Reservation.findOneAndUpdate(
    { username: username, timeEnd: "" },
    {
      $set: {
        timeEnd: timeEnd,
      },
    }
  ); //returns the to be updated reservation

  if (!reservation) {
    return res.status(404).json({ error: "No such reservation found." });
  }

  //res.status(200).json(admin); //return the to be updated admin

  const reservations = await Reservation.find();

  res.status(200).json(reservations);
};

module.exports = {
  createReservation,
  getReservations,
  getReservation,
  deleteReservation,
  updateReservation,
};

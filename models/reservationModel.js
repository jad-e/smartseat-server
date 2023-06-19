const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  timeStart: {
    type: String,
    required: true,
  },
  timeEnd: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  seat: {
    type: String,
    required: true,
  },
  dateTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Reservations", reservationSchema);

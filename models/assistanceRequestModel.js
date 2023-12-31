const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const assistanceRequestSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  dateTime: {
    //5/5/23 13:49 (month/day/year)
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Assist", assistanceRequestSchema);

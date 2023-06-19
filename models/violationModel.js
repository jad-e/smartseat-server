const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const violationSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  violationType: {
    //1, 2, or 3
    type: String,
    required: true,
  },
  time: {
    //13:49
    type: String,
    required: true,
  },
  date: {
    //5 May 2023
    type: String,
    required: true,
  },
  dateTime: {
    //5/5/23 13:49 (month/day/year)
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Violation", violationSchema);

//violation types:
//1: Failure to check-in at a library seat within the prescribed reservation time limit.
//2: Failure to return to a library seat within the prescribed break time limit.
//3: Did not select a break option or tap on the seat withdrawal button when leaving a reserved library seat.

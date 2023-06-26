const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studySpaceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  isTalk: {
    type: Boolean,
    required: true,
  },
  isEat: {
    type: Boolean,
    required: true,
  },
  isDrink: {
    type: Boolean,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  operatingHours: {
    type: String,
    required: true,
  },
  openingTime: {
    type: String,
    required: true,
  },
  closingTime: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  data: {
    type: [Schema.Types.Mixed], //[{seat: L5-A01, status: free/pending/reserved/long break/short break, statusCode: 0/1, userInfo: P19010770 }]
    required: true,
  },
});

module.exports = mongoose.model("Space", studySpaceSchema);

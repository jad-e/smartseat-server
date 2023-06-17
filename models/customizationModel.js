const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const customizationSchema = new Schema({
  revCheckInTimeLimit: {
    type: Number,
    required: true,
  },
  shortBreakTimeLimit: {
    type: Number,
    required: true,
  },
  shortBreakUsageAmount: {
    type: Number,
    required: true,
  },
  lunchBreakTimeLimit: {
    type: Number,
    required: true,
  },
  lunchBreakStartTime: {
    type: String,
    required: true,
  },
  lunchBreakEndTime: {
    type: String,
    required: true,
  },
  lunchBreakUsageAmount: {
    type: Number,
    required: true,
  },
  dinnerBreakTimeLimit: {
    type: Number,
    required: true,
  },
  dinnerBreakStartTime: {
    type: String,
    required: true,
  },
  dinnerBreakEndTime: {
    type: String,
    required: true,
  },
  dinnerBreakUsageAmount: {
    type: Number,
    required: true,
  },
  reservationDisabled: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Customization", customizationSchema);

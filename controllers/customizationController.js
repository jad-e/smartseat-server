const Customization = require("../models/customizationModel");
const mongoose = require("mongoose");

//get all customizations
const getCustomizations = async (req, res) => {
  const customizations = await Customization.find();

  res.status(200).json(customizations);
};

//get a single customization
const getCustomization = async (req, res) => {
  const { id } = req.params;

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid customization ID." });
  }

  //find the customization
  const customization = await Customization.findById(id);

  if (!customization) {
    return res.status(404).json({ error: "No such customization found." });
  }

  res.status(200).json(customization);
};

//post a new customization
const createCustomization = async (req, res) => {
  const {
    revCheckInTimeLimit,
    shortBreakTimeLimit,
    shortBreakUsageAmount,
    lunchBreakTimeLimit,
    lunchBreakStartTime,
    lunchBreakEndTime,
    lunchBreakUsageAmount,
    dinnerBreakTimeLimit,
    dinnerBreakStartTime,
    dinnerBreakEndTime,
    dinnerBreakUsageAmount,
    reservationDisabled,
  } = req.body; //extract the data that comes with the request

  //add doc to db
  try {
    //create a new customization
    const customization = await Customization.create({
      revCheckInTimeLimit,
      shortBreakTimeLimit,
      shortBreakUsageAmount,
      lunchBreakTimeLimit,
      lunchBreakStartTime,
      lunchBreakEndTime,
      lunchBreakUsageAmount,
      dinnerBreakTimeLimit,
      dinnerBreakStartTime,
      dinnerBreakEndTime,
      dinnerBreakUsageAmount,
      reservationDisabled,
    });
    res.status(200).json(customization);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete a customization
const deleteCustomization = async (req, res) => {
  const { id } = req.params;
  const { ids } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid customization ID." });
  }

  const customization = await Customization.deleteMany({ _id: { $in: ids } }); //will return the document that is deleted

  if (!customization) {
    return res.status(404).json({ error: "No such customization(s) found." });
  }

  //res.status(200).json(admin); //return the deleted workout

  const customizations = await Customization.find();

  res.status(200).json(customizations);
};

//update a customization
const updateCustomization = async (req, res) => {
  const { id } = req.params;
  const {
    revCheckInTimeLimit,
    shortBreakTimeLimit,
    shortBreakUsageAmount,
    lunchBreakTimeLimit,
    lunchBreakStartTime,
    lunchBreakEndTime,
    lunchBreakUsageAmount,
    dinnerBreakTimeLimit,
    dinnerBreakStartTime,
    dinnerBreakEndTime,
    dinnerBreakUsageAmount,
    reservationDisabled,
  } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid customization ID." });
  }

  //find and update the wanted customization
  const customization = await Customization.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        revCheckInTimeLimit: revCheckInTimeLimit,
        shortBreakTimeLimit: shortBreakTimeLimit,
        shortBreakUsageAmount: shortBreakUsageAmount,
        shortBreakUsageAmount: shortBreakUsageAmount,
        lunchBreakTimeLimit: lunchBreakTimeLimit,
        lunchBreakStartTime: lunchBreakStartTime,
        lunchBreakEndTime: lunchBreakEndTime,
        lunchBreakUsageAmount: lunchBreakUsageAmount,
        dinnerBreakTimeLimit: dinnerBreakTimeLimit,
        dinnerBreakStartTime: dinnerBreakStartTime,
        dinnerBreakEndTime: dinnerBreakEndTime,
        dinnerBreakUsageAmount: dinnerBreakUsageAmount,
        reservationDisabled: reservationDisabled,
      },
    }
  ); //returns the to be updated customization

  if (!customization) {
    return res.status(404).json({ error: "No such customization found." });
  }

  //res.status(200).json(admin); //return the to be updated admin

  const customizations = await Customization.find();

  res.status(200).json(customizations);
};

module.exports = {
  createCustomization,
  getCustomizations,
  getCustomization,
  deleteCustomization,
  updateCustomization,
};

const mongoose = require("mongoose");
const AssistanceRequest = require("../models/assistanceRequestModel");

//get all assistance requests
const getAssistanceRequests = async (req, res) => {
  const assistanceRequests = await AssistanceRequest.find({}).sort({
    createdAt: -1,
  });

  res.status(200).json(assistanceRequests);
};

//get a single assistance request
const getAssistanceRequest = async (req, res) => {
  const { id } = req.params;

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({
      error: "Invalid assistance request ID.",
    });
  }

  //find the assistance request
  const assistanceRequest = await AssistanceRequest.findById(id);

  if (!assistanceRequest) {
    return res.status(404).json({ error: "No such assistance request found." });
  }

  res.status(200).json(assistanceRequest);
};

//post a new assistance request
const createAssistanceRequest = async (req, res) => {
  const { user_id, username, name, seatNumber, status } = req.body; //extract the data that comes with the request

  //add doc to db
  try {
    //create a new assistance request
    const assistanceRequest = await AssistanceRequest.create({
      username,
      name,
      seatNumber,
      status,
      user_id,
    });
    res.status(200).json(assistanceRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete an assistance request
const deleteAssistanceRequest = async (req, res) => {
  const { id } = req.params;

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid assistance request ID." });
  }

  //find and delete the wanted assistance request
  const assistanceRequest = await AssistanceRequest.findOneAndDelete({
    _id: id,
  }); //will return the document that is deleted

  if (!assistanceRequest) {
    return res.status(404).json({ error: "No such assistance request found." });
  }

  res.status(200).json(assistanceRequest); //return the deleted assistance request
};

//update an assistance request
const updateAssistanceRequest = async (req, res) => {
  const { id } = req.params;

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid assistance request ID." });
  }

  //find and update the wanted assistance request
  const assistanceRequest = await AssistanceRequest.findOneAndUpdate(
    { _id: id },
    { ...req.body }
  ); //returns the to be updated assistance request

  if (!assistanceRequest) {
    return res.status(404).json({ error: "No such assistance request found." });
  }

  res.status(200).json(assistanceRequest); //return the to be updated assistance request
};

module.exports = {
  getAssistanceRequests,
  getAssistanceRequest,
  createAssistanceRequest,
  deleteAssistanceRequest,
  updateAssistanceRequest,
};

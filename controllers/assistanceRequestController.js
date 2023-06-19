const AssistanceRequest = require("../models/assistanceRequestModel");
const mongoose = require("mongoose");

//get all assistance requests
const getAssistanceRequests = async (req, res) => {
  const assistanceRequests = await AssistanceRequest.find();

  res.status(200).json(assistanceRequests);
};

//get a single assistance request
const getAssistanceRequest = async (req, res) => {
  const { id } = req.params;

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid assistance request ID." });
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
  const { username, name, seatNumber, dateTime, status } = req.body; //extract the data that comes with the request

  //add doc to db
  try {
    //create a new assistance request
    const assistanceRequest = await AssistanceRequest.create({
      username,
      name,
      seatNumber,
      dateTime,
      status,
    });
    res.status(200).json(assistanceRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete an assistance request
const deleteAssistanceRequest = async (req, res) => {
  const { id } = req.params;
  const { ids } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid assistance request ID." });
  }

  const assistanceRequest = await AssistanceRequest.deleteMany({
    _id: { $in: ids },
  }); //will return the document that is deleted

  if (!assistanceRequest) {
    return res
      .status(404)
      .json({ error: "No such assistance request(s) found." });
  }

  //res.status(200).json(admin); //return the deleted workout

  const assistanceRequests = await AssistanceRequest.find();

  res.status(200).json(assistanceRequests);
};

//update an assistance request
const updateAssistanceRequest = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid assistance request ID." });
  }

  //find and update the wanted assistance request
  const assistanceRequest = await AssistanceRequest.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: status,
      },
    }
  ); //returns the to be updated assistance request

  if (!assistanceRequest) {
    return res.status(404).json({ error: "No such assistance request found." });
  }

  //res.status(200).json(admin); //return the to be updated admin

  const assistanceRequests = await AssistanceRequest.find();

  res.status(200).json(assistanceRequests);
};

module.exports = {
  createAssistanceRequest,
  getAssistanceRequests,
  getAssistanceRequest,
  deleteAssistanceRequest,
  updateAssistanceRequest,
};

const StudySpace = require("../models/studySpaceModel");
const mongoose = require("mongoose");

//get all study spaces
const getStudySpaces = async (req, res) => {
  const studySpaces = await StudySpace.find();

  res.status(200).json(studySpaces);
};

//get a single study space
const getStudySpace = async (req, res) => {
  const { id } = req.params;
  let target = "";

  switch (id) {
    case "5A":
      target = "6492102dd8f08d6d10277fbe";
      break;
    case "5B":
      target = "64920cfad8f08d6d10277fbd";
      break;
    case "6A":
      target = "6492108bd8f08d6d10277fbf";
      break;
    case "6B":
      target = "64921115d8f08d6d10277fc0";
      break;
    case "6C":
      target = "64921144d8f08d6d10277fc1";
      break;

    default:
      target = "";
  }

  //find the study space
  const studySpace = await StudySpace.findById(target);

  if (!studySpace) {
    return res.status(404).json({ error: "No such study space found." });
  }

  res.status(200).json(studySpace);
};

//post a new study space
const createStudySpace = async (req, res) => {
  const {
    name,
    address,
    isTalk,
    isEat,
    isDrink,
    totalSeats,
    availableSeats,
    operatingHours,
    openingTime,
    closingTime,
    isOpen,
    data,
  } = req.body; //extract the data that comes with the request

  //add doc to db
  try {
    //create a new study space
    const studySpace = await StudySpace.create({
      name,
      address,
      isTalk,
      isEat,
      isDrink,
      totalSeats,
      availableSeats,
      operatingHours,
      openingTime,
      closingTime,
      isOpen,
      data,
    });
    res.status(200).json(studySpace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete a study space
const deleteStudySpace = async (req, res) => {
  const { id } = req.params;
  const { ids } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid study space ID." });
  }

  const studySpace = await StudySpace.deleteMany({ _id: { $in: ids } }); //will return the document that is deleted

  if (!studySpace) {
    return res.status(404).json({ error: "No such study space(s) found." });
  }

  //res.status(200).json(admin); //return the deleted workout

  const studySpaces = await StudySpace.find();

  res.status(200).json(studySpaces);
};

//update a study space
const updateStudySpace = async (req, res) => {
  const { id } = req.params;
  const { availableSeats, data } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid study space ID." });
  }

  console.log("im am in here now");

  //find and update the wanted study space
  const studySpace = await StudySpace.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        availableSeats: availableSeats,
        data: data,
      },
    }
  ); //returns the to be updated study space

  if (!studySpace) {
    console.log("err1");
    return res.status(404).json({ error: "No such study space found." });
  }

  console.log("outhere..");

  //res.status(200).json(admin); //return the to be updated admin

  const studySpaces = await StudySpace.find();

  res.status(200).json(studySpaces);
};

module.exports = {
  createStudySpace,
  getStudySpaces,
  getStudySpace,
  deleteStudySpace,
  updateStudySpace,
};

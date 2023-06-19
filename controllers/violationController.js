const Violation = require("../models/violationModel");
const mongoose = require("mongoose");

//get all violations
const getViolations = async (req, res) => {
  const violations = await Violation.find();

  res.status(200).json(violations);
};

//get a single violation
const getViolation = async (req, res) => {
  const { id } = req.params;

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid violation ID." });
  }

  //find the violation
  const violation = await Violation.findById(id);

  if (!violation) {
    return res.status(404).json({ error: "No such violation found." });
  }

  res.status(200).json(violation);
};

//post a new violation
const createViolation = async (req, res) => {
  const { username, name, violationType, time, date, dateTime } = req.body; //extract the data that comes with the request

  //add doc to db
  try {
    //create a new violation
    const violation = await Violation.create({
      username,
      name,
      violationType,
      time,
      date,
      dateTime,
    });
    res.status(200).json(violation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete a violation
const deleteViolation = async (req, res) => {
  const { id } = req.params;
  const { ids } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid violation ID." });
  }

  const violation = await Violation.deleteMany({ _id: { $in: ids } }); //will return the document that is deleted

  if (!violation) {
    return res.status(404).json({ error: "No such violation(s) found." });
  }

  //res.status(200).json(admin); //return the deleted workout

  const violations = await Violation.find();

  res.status(200).json(violations);
};

//update a violation
const updateViolation = async (req, res) => {
  const { id } = req.params;
  const { name, violationType, time, date, dateTime } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid violation ID." });
  }

  //find and update the wanted violation
  const violation = await Violation.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: name,
        violationType: violationType,
        time: time,
        date: date,
        dateTime: dateTime,
      },
    }
  ); //returns the to be updated violation

  if (!violation) {
    return res.status(404).json({ error: "No such violation found." });
  }

  //res.status(200).json(admin); //return the to be updated admin

  const violations = await Violation.find();

  res.status(200).json(violations);
};

module.exports = {
  createViolation,
  getViolations,
  getViolation,
  deleteViolation,
  updateViolation,
};

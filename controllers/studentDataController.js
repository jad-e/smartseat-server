const Student = require("../models/studentUserModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//get all students
const getStudents = async (req, res) => {
  const students = await Student.find();

  res.status(200).json(students);
};

//get a single student
const getStudent = async (req, res) => {
  const { id } = req.params; //1
  const user_id = req.studentUser._id;

  //find the student
  const student = await Student.findById(user_id);

  if (!student) {
    return res.status(404).json({ error: "No such student found." });
  }

  res.status(200).json(student);
};

//post a new student
const createStudent = async (req, res) => {
  const {
    name,
    username,
    password,
    email,
    phoneNumber,
    gender,
    birthday,
    school,
  } = req.body; //extract the data that comes with the request

  //add doc to db
  try {
    //check for username uniqueness
    const exists = await Student.findOne({ username });

    if (exists) {
      throw Error("Username already in use.");
    }

    //hash the password [mypassword + salt]
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //create a new student
    const student = await Student.create({
      name,
      username,
      password: hash,
      email,
      phoneNumber,
      gender,
      birthday,
      school,
      reserveNum: 0,
      violateNum: 0,
      blacklistNum: 0,
      authStat: "Authorized",
      seatStat: "None",
    });
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete a student
const deleteStudent = async (req, res) => {
  const { id } = req.params;
  const { ids } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid student ID." });
  }

  const student = await Student.deleteMany({ _id: { $in: ids } }); //will return the document that is deleted

  if (!student) {
    return res.status(404).json({ error: "No such student(s) found." });
  }

  //res.status(200).json(admin); //return the deleted workout

  const students = await Student.find();

  res.status(200).json(students);
};

//update a student
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phoneNumber,
    gender,
    birthday,
    school,
    violateNum,
    blacklistNum,
    authStat,
  } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid student ID." });
  }

  //find and update the wanted student
  const student = await Student.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        gender: gender,
        birthday: birthday,
        school: school,
        violateNum: violateNum,
        blacklistNum: blacklistNum,
        authStat: authStat,
      },
    }
  ); //returns the to be updated student

  if (!student) {
    return res.status(404).json({ error: "No such student found." });
  }

  //res.status(200).json(admin); //return the to be updated admin

  const students = await Student.find();

  res.status(200).json(students);
};

module.exports = {
  createStudent,
  getStudents,
  getStudent,
  deleteStudent,
  updateStudent,
};

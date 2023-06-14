const Admin = require("../models/adminUserModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//get all admins
const getAdmins = async (req, res) => {
  const admins = await Admin.find();

  res.status(200).json(admins);
};

//get a single admin
const getAdmin = async (req, res) => {
  const { id } = req.params;

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid admin ID." });
  }

  //find the admin
  const admin = await Admin.findById(id);

  if (!admin) {
    return res.status(404).json({ error: "No such admin found." });
  }

  res.status(200).json(admin);
};

//post a new admin
const createAdmin = async (req, res) => {
  const { name, username, password, phoneNumber, email } = req.body; //extract the data that comes with the request

  //add doc to db
  try {
    //check for username uniqueness
    const exists = await Admin.findOne({ username });

    if (exists) {
      throw Error("Username already in use.");
    }

    //hash the password [mypassword + salt]
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //create a new admin
    const admin = await Admin.create({
      name,
      username,
      password: hash,
      phoneNumber,
      email,
    });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete an admin
const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  const { ids } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid admin ID." });
  }

  const admin = await Admin.deleteMany({ _id: { $in: ids } }); //will return the document that is deleted

  if (!admin) {
    return res.status(404).json({ error: "No such admin(s) found." });
  }

  //res.status(200).json(admin); //return the deleted workout

  const admins = await Admin.find();

  res.status(200).json(admins);
};

//update an admin
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, phoneNumber, email } = req.body; //extract the data that comes with the request

  //make sure it is a valid type of id (mongodb type of id)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //if its not valid
    return res.status(404).json({ error: "Invalid admin ID." });
  }

  //find and update the wanted admin
  const admin = await Admin.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: name,
        phoneNumber: phoneNumber,
        email: email,
      },
    }
  ); //returns the to be updated admin

  if (!admin) {
    return res.status(404).json({ error: "No such admin found." });
  }

  //res.status(200).json(admin); //return the to be updated admin

  const admins = await Admin.find();

  res.status(200).json(admins);
};

module.exports = {
  createAdmin,
  getAdmins,
  getAdmin,
  deleteAdmin,
  updateAdmin,
};

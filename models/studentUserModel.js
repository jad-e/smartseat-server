const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const studentUserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  profImg: {
    //NOT REQUIRED
    type: String,
  },
  reserveNum: {
    type: Number,
    required: true,
  },
  violateNum: {
    type: Number,
    required: true,
  },
  blacklistNum: {
    type: Number,
    required: true,
  },
  authStat: {
    type: String,
    required: true,
  },
  seatStat: {
    type: String,
    required: true,
  },
  timeline: {
    //NOT REQUIRED
    type: String,
  },
});

//static login method
studentUserSchema.statics.login = async function (username, password) {
  //check if the student user account exists (find the user)
  const studentUser = await this.findOne({ username }); //returns student document info if found

  if (studentUser.authStat === "Blacklisted") {
    throw Error("You are currently blacklisted.");
  }

  if (!studentUser) {
    //if can't find anyone with the username
    throw Error("Incorrect username.");
  }

  //if user exists, try to match the password
  const match = await bcrypt.compare(password, studentUser.password);

  if (!match) {
    throw Error("Incorrect password.");
  }

  return studentUser; //will return the student information if username and password matches (login success)
};

module.exports = mongoose.model("Student", studentUserSchema);

// DEFAULT STUDENT LOGIN CREDENTIALS:
// Username: P19010770
// Password: HuiYing123!

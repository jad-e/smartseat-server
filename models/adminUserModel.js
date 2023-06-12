const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const adminUserSchema = new Schema(
  {
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
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

//static login method
adminUserSchema.statics.login = async function (username, password) {
  console.log(username);
  console.log(password);

  // validation
  if (!username || !password) {
    //check for emptiness
    throw Error("All fields must be filled.");
  }

  //check if the admin user account exists (find the user)
  const adminUser = await this.findOne({ username }); //returns admin document info if found

  if (!adminUser) {
    //if can't find anyone with the username
    throw Error("Incorrect username.");
  }

  //if user exists, try to match the password
  // TO BE REOPENED BACK !!!!!
  //const match = await bcrypt.compare(password, adminUser.password);

  // if (!match) {
  //   throw Error("Incorrect password.");
  // }

  return adminUser; //will return the admin information if username and password matches (login success)
};

module.exports = mongoose.model("Admin", adminUserSchema);

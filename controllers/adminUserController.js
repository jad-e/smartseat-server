const AdminUser = require("../models/adminUserModel");
const jwt = require("jsonwebtoken");

//function to generate json token
const createToken = (_id) => {
  //arg1: payload, arg2: secret string, arg3: options
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" }); //token will expire in 3 days (can be logged in for atmost 3 days)
};

//login admin user
const loginAdminUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const adminUser = await AdminUser.login(username, password);

    // create a json token
    const token = createToken(adminUser._id); //the unqiue id of the each admin document will act as the non-sensitive json webtoken payload

    res.status(200).json({ username, token }); //send a json token back (along with admin username)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginAdminUser };

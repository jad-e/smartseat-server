const jwt = require("jsonwebtoken");
const StudentUser = require("../models/studentUserModel");

const requireAuth = async function (req, res, next) {
  //verify if student user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required." });
  }

  const token = authorization.split(" ")[1];

  // verify the token is not tampered with
  try {
    //grab the payload from the token
    const { _id } = jwt.verify(token, process.env.SECRET);

    //attach the id property to request
    //user property can be changed to any name like abc too
    req.studentUser = await StudentUser.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized." });
  }
};

module.exports = requireAuth;

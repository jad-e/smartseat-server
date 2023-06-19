const express = require("express");

//controller functions
const { loginStudentUser } = require("../controllers/studentUserController");

const router = express.Router();

//login route
router.post("/login", loginStudentUser);

module.exports = router;

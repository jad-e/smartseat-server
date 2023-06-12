const express = require("express");

//controller functions
const { loginAdminUser } = require("../controllers/adminUserController");

const router = express.Router();

//login route
router.post("/login", loginAdminUser);

module.exports = router;

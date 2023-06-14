const express = require("express");

const {
  createAdmin,
  getAdmins,
  getAdmin,
  deleteAdmin,
  updateAdmin,
} = require("../controllers/adminDataController");

const router = express.Router();

//get all admins
router.get("/", getAdmins);

//get a single admin
router.get("/:id", getAdmin);

//post a new admin
router.post("/", createAdmin);

//delete an admin
router.delete("/:id", deleteAdmin);

//update an admin
router.patch("/:id", updateAdmin);

module.exports = router;

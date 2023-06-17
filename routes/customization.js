const express = require("express");

const {
  createCustomization,
  getCustomizations,
  getCustomization,
  deleteCustomization,
  updateCustomization,
} = require("../controllers/customizationController");

const router = express.Router();

//get all admins
router.get("/", getCustomizations);

//get a single admin
router.get("/:id", getCustomization);

//post a new admin
router.post("/", createCustomization);

//delete an admin
router.delete("/:id", deleteCustomization);

//update an admin
router.patch("/:id", updateCustomization);

module.exports = router;

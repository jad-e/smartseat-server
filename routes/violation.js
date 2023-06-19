const express = require("express");

const {
  createViolation,
  getViolations,
  getViolation,
  deleteViolation,
  updateViolation,
} = require("../controllers/violationController");

const router = express.Router();

//get all violations
router.get("/", getViolations);

//get a single violation
router.get("/:id", getViolation);

//post a new violation
router.post("/", createViolation);

//delete a violation
router.delete("/:id", deleteViolation);

//update a violation
router.patch("/:id", updateViolation);

module.exports = router;

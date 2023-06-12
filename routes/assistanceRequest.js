const express = require("express");

const {
  getAssistanceRequests,
  getAssistanceRequest,
  createAssistanceRequest,
  deleteAssistanceRequest,
  updateAssistanceRequest,
} = require("../controllers/assistanceRequestController");

const router = express.Router();

//get all assistance request
router.get("/", getAssistanceRequests);

//get a single assistance request
router.get("/:id", getAssistanceRequest);

//post a new assistance request
router.post("/", createAssistanceRequest);

//delete an assistance request
router.delete("/:id", deleteAssistanceRequest);

//update a new workout
router.patch("/:id", updateAssistanceRequest);

module.exports = router;

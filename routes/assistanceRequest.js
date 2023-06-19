const express = require("express");

const {
  createAssistanceRequest,
  getAssistanceRequests,
  getAssistanceRequest,
  deleteAssistanceRequest,
  updateAssistanceRequest,
} = require("../controllers/assistanceRequestController");

const router = express.Router();

//get all assistance requests
router.get("/", getAssistanceRequests);

//get a single assistance request
router.get("/:id", getAssistanceRequest);

//post a new assistance request
router.post("/", createAssistanceRequest);

//delete an assistance request
router.delete("/:id", deleteAssistanceRequest);

//update an assistance request
router.patch("/:id", updateAssistanceRequest);

module.exports = router;

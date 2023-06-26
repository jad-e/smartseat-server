const express = require("express");

const {
  createStudySpace,
  getStudySpaces,
  getStudySpace,
  deleteStudySpace,
  updateStudySpace,
} = require("../controllers/studySpaceController");

const router = express.Router();

//get all study spaces
router.get("/", getStudySpaces);

//get a single study space
router.get("/:id", getStudySpace);

//post a new study space
router.post("/", createStudySpace);

//delete a study space
router.delete("/:id", deleteStudySpace);

//update a study space
router.patch("/:id", updateStudySpace);

module.exports = router;

const express = require("express");

const {
  createStudent,
  getStudents,
  getStudent,
  deleteStudent,
  updateStudent,
} = require("../controllers/studentDataController");

const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

//require auth for all studentData routes
router.use(requireAuth); //fire the middleware function

//get all students
router.get("/", getStudents);

//get a single student
router.get("/:id", getStudent);

//post a new student
router.post("/", createStudent);

//delete a student
router.delete("/:id", deleteStudent);

//update a student
router.patch("/:id", updateStudent);

module.exports = router;

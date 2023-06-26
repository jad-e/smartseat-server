require("dotenv").config(); //attaches the env variables into the process object
var cron = require("node-cron");
var moment = require("moment");
const mongoose = require("mongoose");

const adminUserRoutes = require("./routes/adminUser");
const adminDataRoutes = require("./routes/adminData");
const studentDataRoutes = require("./routes/studentData");
const customizationRoutes = require("./routes/customization");

const violationRoutes = require("./routes/violation");
const assistanceRequestRoutes = require("./routes/assistanceRequest");
const reservationRoutes = require("./routes/reservation");

const studentUserRoutes = require("./routes/studentUser");
const studySpaceRoutes = require("./routes/studySpace");

//require models
const Student = require("./models/studentUserModel");
const StudySpace = require("./models/studySpaceModel");
const Violation = require("./models/violationModel");
const Reservation = require("./models/reservationModel");

const express = require("express");
const { createServer } = require("http");
const cors = require("cors");

// store express app in app var
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", function (socket) {
  console.log("Study space connected.");

  //get the passed data
  socket.on("statusCode", async (statusCode) => {
    //console.log(statusCode);

    //PERFORM CHECKING HERE
    var v_space = statusCode.split("_")[0];
    var v_seat = statusCode.split("_")[1];
    var v_stat = statusCode.split("_")[2];

    if (v_stat === "EMPTY") {
      //find the seat
      const studySpaces = await StudySpace.find({});

      for (const studySpace of studySpaces) {
        if (studySpace.name === v_space) {
          for (const space of studySpace.data) {
            if (space.seat === v_seat && space.status === "Occupied") {
              //this is violation type 3

              //find the student
              const student = await Student.find({ username: space.userInfo });

              console.log(
                `${student.username}'s seat at ${v_seat} has expired.`
              );

              //UPDATE STUDY SPACES
              studySpace.availableSeats += 1;
              space.status = "Free";
              space.userInfo = "-";

              studySpace.markModified("availableSeats");
              studySpace.markModified("data");
              await studySpace.save();

              //UPDATE RESERVATION LIST
              const reservations = await Reservation.find({});

              for (const reservation of reservations) {
                if (
                  reservation.username === student.username &&
                  reservation.timeEnd === ""
                ) {
                  reservation.timeEnd = time;
                  await reservation.save();
                }
              }

              const d1 = new Date();
              const d2 = new Date();
              const d3 = new Date();
              const d4 = new Date();
              const d5 = new Date();
              const d6 = new Date();

              const unique =
                "" +
                d1.getFullYear() +
                (d2.getMonth() + 1) +
                d3.getDate() +
                d4.getHours() +
                d5.getMinutes() +
                d6.getSeconds();

              //UPDATE STUDENT DATA

              //vio obj
              const vio = {
                id: parseInt(unique), //yearmonthdayhrminsecs
                type: 1,
                violationType: 3,
                time: time,
                date: moment(mDate).format("D MMMM Y"),
              };

              //get current timeline data
              let tempArr = student.timeline.map((obj) =>
                obj.type === 2 && timeEnd === ""
                  ? {
                      ...obj,
                      timeEnd: time,
                    }
                  : obj
              );
              tempArr.push(vio);

              student.shortBreakEndTime = "";
              student.longBreakEndTime = "";
              student.seatStat = "None";
              student.timeline = tempArr;
              student.violateNum += 1;
              student.dinnerBreakCount = 0;
              student.lunchBreakCount = 0;
              student.shortBreakCount = 0;
              await student.save();

              //ADD TO VIOLATION
              const violation = await Violation.create({
                username: student.username,
                name: student.name,
                violationType:
                  "Did not select a break option or tap on the seat withdrawal button when leaving a reserved library seat.",
                time: time,
                date: moment(mDate).format("D MMMM Y"),
                dateTime: moment().format("MM/DD/YYYY") + " " + time,
              });
            }
          }
        }
      }
    }
  });
});

//middleware
app.use(express.json()); //for any requests that comes in, look if there is a body of data, if yes, pass and attach to req var

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/adminUser", adminUserRoutes); //when user goes to "/api/adminUser", try the adminUserRoutes
app.use("/api/adminData", adminDataRoutes);
app.use("/api/studentData", studentDataRoutes);
app.use("/api/customization", customizationRoutes);

app.use("/api/violation", violationRoutes);
app.use("/api/assistanceRequest", assistanceRequestRoutes); //when user goes to "/api/assistanceRequest", try the assistanceRequestRoutes
app.use("/api/reservation", reservationRoutes);

app.use("/api/studentUser", studentUserRoutes);
app.use("/api/studySpace", studySpaceRoutes);

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen for requests
    httpServer.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port 4000");
    });
  })
  .catch((error) => {
    console.log(error);
  });

var taskReserveCheckIn = cron.schedule("* * * * *", async () => {
  const students = await Student.find({});

  students.forEach(async (student) => {
    //if on seat / on break
    if (student.checkInEndTime === "") return;

    var checkInEnd_val = new Date();
    var checkin_end = checkInEnd_val.setHours(
      parseInt(student.checkInEndTime.split(":")[0]),
      parseInt(student.checkInEndTime.split(":")[1])
    );

    if (
      //date now > checkInEndTime
      Date.now() > checkin_end
    ) {
      let targetSeat = student.seatStat.split("_")[2];
      console.log(
        `Seat reservation at ${targetSeat} by ${student.username} has expired.`
      );

      //UPDATE STUDY SPACES RECORD

      const studySpaces = await StudySpace.find({});

      for (const studySpace of studySpaces) {
        if (studySpace.name === student.seatStat.split("_")[1]) {
          studySpace.availableSeats += 1;

          for (const space of studySpace.data) {
            if (space.userInfo === student.username) {
              space.status = "Free";
              space.userInfo = "-";
            }
          }
          studySpace.markModified("availableSeats");
          studySpace.markModified("data");
          await studySpace.save();
        }
      }

      //current data and time
      const date = new Date().toLocaleDateString();
      const mDate = new Date();
      const time = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
      });

      const d1 = new Date();
      const d2 = new Date();
      const d3 = new Date();
      const d4 = new Date();
      const d5 = new Date();
      const d6 = new Date();

      const unique =
        "" +
        d1.getFullYear() +
        (d2.getMonth() + 1) +
        d3.getDate() +
        d4.getHours() +
        d5.getMinutes() +
        d6.getSeconds();

      //UPDATE STUDENT RECORD

      //vio obj
      const vio = {
        id: parseInt(unique), //yearmonthdayhrminsecs
        type: 1,
        violationType: 1,
        time: time,
        date: moment(mDate).format("D MMMM Y"),
      };

      //get current timeline data
      let tempArr = student.timeline.map((obj) =>
        obj.type === 2 && timeEnd === ""
          ? {
              ...obj,
              timeEnd: time,
            }
          : obj
      );
      tempArr.push(vio);

      student.checkInEndTime = "";
      student.seatStat = "None";
      student.delayed = false;
      student.timeline = tempArr;
      student.violateNum += 1;
      await student.save();

      //ADD TO VIOLATION RECORDS

      const violation = await Violation.create({
        username: student.username,
        name: student.name,
        violationType:
          "Failure to check-in at a library seat within the prescribed reservation time limit.",
        time: time,
        date: moment(mDate).format("D MMMM Y"),
        dateTime: moment().format("MM/DD/YYYY") + " " + time,
      });
    }
  });
});

var taskBreakCheckIn = cron.schedule("* * * * *", async () => {
  const students = await Student.find({});

  students.forEach(async (student) => {
    //if on pending reservation
    if (student.checkInEndTime !== "") {
      return;
    }

    //if on seat
    if (
      student.shortBreakEndTime === "" &&
      student.longBreakEndTime === "" &&
      student.checkInEndTime === ""
    ) {
      return;
    }

    const breakEndTime = student.shortBreakEndTime + student.longBreakEndTime;

    var breakCheckInEnd_val = new Date();
    var breakcheckin_end = breakCheckInEnd_val.setHours(
      parseInt(breakEndTime.split(":")[0]),
      parseInt(breakEndTime.split(":")[1])
    );

    if (
      //date now > checkInEndTime
      Date.now() > breakcheckin_end
    ) {
      let targetSeat = student.seatStat.split("_")[2];
      console.log(
        `${student.username}'s break time at ${targetSeat} has expired.`
      );

      //UPDATE STUDY SPACES RECORD

      const studySpaces = await StudySpace.find({});

      for (const studySpace of studySpaces) {
        if (studySpace.name === student.seatStat.split("_")[1]) {
          studySpace.availableSeats += 1;

          for (const space of studySpace.data) {
            if (space.userInfo === student.username) {
              space.status = "Free";
              space.userInfo = "-";
            }
          }
          studySpace.markModified("availableSeats");
          studySpace.markModified("data");
          await studySpace.save();
        }
      }

      //current data and time
      const date = new Date().toLocaleDateString();
      const mDate = new Date();
      const time = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "numeric",
        minute: "numeric",
      });

      //UPDATE RESERVATION LIST - end time

      const reservations = await Reservation.find({});

      for (const reservation of reservations) {
        if (
          reservation.username === student.username &&
          reservation.timeEnd === ""
        ) {
          reservation.timeEnd = time;
          await reservation.save();
        }
      }

      const d1 = new Date();
      const d2 = new Date();
      const d3 = new Date();
      const d4 = new Date();
      const d5 = new Date();
      const d6 = new Date();

      const unique =
        "" +
        d1.getFullYear() +
        (d2.getMonth() + 1) +
        d3.getDate() +
        d4.getHours() +
        d5.getMinutes() +
        d6.getSeconds();

      //UPDATE STUDENT RECORD

      //vio obj
      const vio = {
        id: parseInt(unique), //yearmonthdayhrminsecs
        type: 1,
        violationType: 2,
        time: time,
        date: moment(mDate).format("D MMMM Y"),
      };

      //get current timeline data
      let tempArr = student.timeline.map((obj) =>
        obj.type === 2 && timeEnd === ""
          ? {
              ...obj,
              timeEnd: time,
            }
          : obj
      );
      tempArr.push(vio);

      student.shortBreakEndTime = "";
      student.longBreakEndTime = "";
      student.seatStat = "None";
      student.timeline = tempArr;
      student.violateNum += 1;
      student.dinnerBreakCount = 0;
      student.lunchBreakCount = 0;
      student.shortBreakCount = 0;
      await student.save();

      //ADD TO VIOLATION RECORDS

      const violation = await Violation.create({
        username: student.username,
        name: student.name,
        violationType:
          "Failure to return to a library seat within the prescribed break time limit.",
        time: time,
        date: moment(mDate).format("D MMMM Y"),
        dateTime: moment().format("MM/DD/YYYY") + " " + time,
      });
    }
  });
});

taskReserveCheckIn.start();
taskBreakCheckIn.start();

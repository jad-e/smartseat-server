require("dotenv").config(); //attaches the env variables into the process object

const express = require("express");
const mongoose = require("mongoose");
const adminUserRoutes = require("./routes/adminUser");
const assistanceRequestRoutes = require("./routes/assistanceRequest");

// store express app in app var
const app = express();

//middleware
app.use(express.json()); //for any requests that comes in, look if there is a body of data, if yes, pass and attach to req var

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/assistanceRequest", assistanceRequestRoutes); //when user goes to "/api/assistanceRequest", try the assistanceRequestRoutes
app.use("/api/adminUser", adminUserRoutes); //when user goes to "/api/adminUser", try the adminUserRoutes

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port 4000");
    });
  })
  .catch((error) => {
    console.log(error);
  });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const patientRouter = require("./src/routes/patient");
const doctorRouter = require("./src/routes/doctor");
const bookingRouter = require("./src/routes/booking");
const consultationRouter = require("./src/routes/consultation");
const appointmentRouter = require("./src/routes/appointment");
const ivrRouter = require("./src/routes/ivr");

const { logger } = require("./logger");
const port = process.env.PORT || 5001;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "50mb" }));

app.get("/health", (_req, res) => {
  res.json({ uptime: process.uptime(), message: "OK", timestamp: new Date() });
});

app.use("/patient", patientRouter);

app.use("/doctor", doctorRouter);

app.use("/booking", bookingRouter);

app.use("/consultation", consultationRouter);

app.use("/appointment", appointmentRouter);

app.use("/ivr", ivrRouter);

app.listen(port, () => {
  logger.info(`Application started at port ${port}`);
});

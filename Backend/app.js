const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const booking = require("./patient/booking/book-appointment");
const patientRegister = require("./patient/login-register/register");
const patientLogin = require("./patient/login-register/login");
const doctorRegister = require("./doctor/login-register/register");
const doctorLogin = require("./doctor/login-register/login");

const db = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "voice_based_eprescription",
  },
});

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    console.log(booking)
    res.send(JSON.stringify("Hello world"));
});

//<---Patient Login-register -->
app.post("/patient/register", (req, res) => {
  patientRegister.handlePatientRegister(req, res, db);
});

app.post("/patient/login", (req, res) => {
  patientLogin.handlePatientLogin(req, res, db);
});


//<---Doctor Login-register -->
app.post("/doctor/register", (req, res) => {
  doctorRegister.handleDoctorRegister(req, res, db);
});

app.post("/doctor/login", (req, res) => {
  doctorLogin.handleDoctorLogin(req, res, db);
});


//<--- Booking -->
app.get("/get-available-slots", (req, res) => {
  booking.getAvailableSlots(req, res, db);
});

app.post("/book-slot", (req, res) => {
  booking.bookSlot(req, res, db);
});


app.listen(3000, () => {
  console.log("app is running on port 3000");
});


const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const patient = require("./src/patient");
const doctor = require("./src/doctor");
const consultation = require("./src/consultation/consultation");
const appointment = require("./src/consultation/appointment");
const booking = require("./src/consultation/book-appointment");
const ivrHandler = require("./src/ivr");
const knex = require("./src/knex");
const db = require("knex")(knex.config);

const multer = require("multer");
let storage = multer.memoryStorage();
let upload = multer({ storage: storage });
const port = process.env.PORT || 5001;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send(JSON.stringify("Hello world"));
});

//<--- Patient --->
app.get("/patient", (req, res) => {
  patient.getPatientsList(req, res, db);
});

app.get("/patient/:id", (req, res) => {
  patient.getPatientWithID(req, res, db);
});

app.post("/patient/register", (req, res) => {
  patient.handlePatientRegister(req, res, db);
});

app.put("/patient/register", (req, res) => {
  patient.updatePatientRegister(req, res, db);
});

app.post("/patient/login", (req, res) => {
  patient.handlePatientLogin(req, res, db);
});

//<--- Doctor --->
app.get("/doctor", (req, res) => {
  doctor.getDoctorsList(req, res, db);
});

app.get("/doctor/:id", (req, res) => {
  doctor.getDoctorWithID(req, res, db);
});

app.get("/get-available-doctors", (req, res) => {
  doctor.getAvailableDoctors(req, res, db);
});

app.post("/get-doctor-with-role", (req, res) => {
  doctor.getDoctorWithRole(req, res, db);
});

app.post("/doctor/register", upload.single("sign-image"), (req, res) => {
  doctor.handleDoctorRegister(req, res, db);
});

app.post("/doctor/login", (req, res) => {
  doctor.handleDoctorLogin(req, res, db);
});

//<--- Booking -->
app.get("/get-slots", (req, res) => {
  booking.getSlots(req, res, db);
});

app.get("/get-available-slots", (req, res) => {
  booking.getAvailableSlots(req, res, db);
});

app.post("/book-slot", (req, res) => {
  booking.bookSlot(req, res, db);
});

app.post("/unblock-slots", (req, res) => {
  booking.unblockAllSlots(req, res, db);
});

//<--- Consultation -->
app.get("/consultation", (req, res) => {
  consultation.getConsultationList(req, res, db);
});

app.get("/consultation/:id", (req, res) => {
  consultation.getConsultationWithID(req, res, db);
});
app.get("/consultation/patient/:id", (req, res) => {
  consultation.getPatientConsultation(req, res, db);
});
app.get("/consultation/doctor/:id", (req, res) => {
  consultation.getDoctorConsultation(req, res, db);
});
app.post("/consultation", (req, res) => {
  consultation.addConsultationInfo(req, res, db);
});

//<--- Appointment -->
app.get("/appointment", (req, res) => {
  appointment.getAppointmentList(req, res, db);
});

app.get("/appointment/:id", (req, res) => {
  appointment.getAppointmentWithID(req, res, db);
});

app.get("/appointment/patient/:id", (req, res) => {
  appointment.getAppointmentWithPID(req, res, db);
});

app.get("/appointment/doctor/:id", (req, res) => {
  appointment.getAppointmentWithDID(req, res, db);
});

app.post("/appointment/cancel", (req, res) => {
  appointment.cancelAppointment(req, res, db);
});

//<--- IVR -->
app.post("/ivr-request", (req, res) => {
  ivrHandler.handleIVRRequest(req, res, db);
});

app.post("/ivr/login", (req, res) => {
  ivrHandler.handleLoginMenu(req, res, db);
});

app.post("/ivr/menu", (req, res) => {
  ivrHandler.ivrMenu(req, res, db);
});

app.post("/ivr/booking-menu/:id", (req, res) => {
  ivrHandler.bookingMenu(req, res, db);
});

app.post("/ivr/appointment/:id", (req, res) => {
  ivrHandler.appointmentMenu(req, res, db);
});

// app.post("/ivr/pidmenu", (req, res) => {
//   ivrHandler.pidMenu(req, res, db);
// });

// app.post("/ivr/booking", (req, res) => {
//   ivrHandler.bookingMenu(req, res, db);
// });

//<--- Main -->
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

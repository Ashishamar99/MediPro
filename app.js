const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const patient = require("./src/patient");
const doctor = require("./src/doctor");
const consultation = require("./src/consultation/consultation");
const appointment = require("./src/consultation/appointment");
const booking = require("./src/consultation/book-appointment");
const ivrHandler = require("./src/ivr");
const port = process.env.PORT || 3000;

const productionServer = {
  host: "voice-based-eprescription.c6evra5ifcck.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "abhi1234",
  database: "voice-based-eprescription",
};

const localServer = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "voice_based_eprescription",
};

const db = require("knex")({
  client: "mysql",
  connection: {
    host: localServer.host,
    user: localServer.user,
    password: localServer.password,
    database: localServer.database,
  },
});

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

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

app.post("/doctor/register", (req, res) => {
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

//<--- IVR -->
app.post("/ivr-request", (req, res) => {
  ivrHandler.handleIVRRequest(req, res, db);
});

app.post("/ivr/menu", (req, res) => {
  ivrHandler.ivrMenu(req, res, db);
});

//<--- Main -->
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

// const accountSid = 'ACbe11bf5856751706836158a633466d34';
// const authToken = 'a0ee05fa5617e158dd302945f36e811c';
// const client = require("twilio")(accountSid, authToken);

// var numberReceived = 'sdf';
// let fetchRecentCall = async() => {
//   client.calls.list({limit: 1})
//               .then(calls => calls.forEach(c => {
//                 console.log(`Time = ${c.dateUpdated}, From = ${c.from}`);
//                 numberReceived=c.from;
//                                           })
//                     );
//                                 }

// fetchRecentCall.then(console.log(numberReceived));



/*
Call obj

{
  sid: 'CAffb7a2485e304b7f050211e200d5f64c',        
  dateCreated: 2021-06-20T07:26:31.000Z,
  dateUpdated: 2021-06-20T07:26:52.000Z,
  parentCallSid: null,
  accountSid: 'ACbe11bf5856751706836158a633466d34', 
  to: '+19524666893',
  toFormatted: '(952) 466-6893',
  from: '+916361599901',
  fromFormatted: '+916361599901',
  phoneNumberSid: 'PNb7acbb6caa2ae149ea2dfe76f8a5a2eb',
  status: 'completed',
  startTime: 2021-06-20T07:26:42.000Z,
  endTime: 2021-06-20T07:26:52.000Z,
  duration: '10',
  price: '-0.00850',
  priceUnit: 'USD',
  direction: 'inbound',
  answeredBy: null,
  annotation: null,
  apiVersion: '2010-04-01',
  forwardedFrom: '+19524666893',
  groupSid: null,
  callerName: null,
  queueTime: '0',
  trunkSid: '',
  uri: '/2010-04-01/Accounts/ACbe11bf5856751706836158a633466d34/Calls/CAffb7a2485e304b7f050211e200d5f64c.json',
  subresourceUris: {
    notifications: '/2010-04-01/Accounts/ACbe11bf5856751706836158a633466d34/Calls/CAffb7a2485e304b7f050211e200d5f64c/Notifications.json',
    recordings: '/2010-04-01/Accounts/ACbe11bf5856751706836158a633466d34/Calls/CAffb7a2485e304b7f050211e200d5f64c/Recordings.json'
  }
*/
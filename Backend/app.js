const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const booking = require("./patient/booking/book-appointment");
const login = require("./patient/login-register/login");
const register = require("./patient/login-register/register");
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

//<--- Login-register -->
app.post("/login", (req, res) => {
  login.handleLogin(req, res, db);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db);
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


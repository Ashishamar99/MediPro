const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const booking = require("./booking/book-appointment");

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

app.get("/get-available-slots", (req, res) => {
  booking.getAvailableSlots(req, res, db);
});

app.post("/book-slot", (req, res) => {
  booking.bookSlot(req, res, db);
});


app.listen(3000, () => {
  console.log("app is running on port 3000");
});


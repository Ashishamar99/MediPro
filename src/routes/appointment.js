const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment");

router.get("/", (req, res) => {
  appointmentController.getAppointmentList(req, res);
});

router.get("/:id", (req, res) => {
  appointmentController.getAppointmentWithID(req, res);
});

router.get("/patient/:id", (req, res) => {
  appointmentController.getAppointmentWithPID(req, res);
});

router.get("/doctor/:id", (req, res) => {
  appointmentController.getAppointmentWithDID(req, res);
});

router.post("/cancel", (req, res) => {
  appointmentController.cancelAppointment(req, res);
});

module.exports = router;

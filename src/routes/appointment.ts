import express from "express";
import * as appointmentController from "../controllers/appointment";
const router = express.Router();

router.get("/", (req, res) => {
  void appointmentController.getAppointmentList(req, res);
});

// router.get("/:id", (req, res) => {
//   appointmentController.getAppointmentWithID(req, res);
// });

// router.get("/patient/:id", (req, res) => {
//   appointmentController.getAppointmentWithPID(req, res);
// });

router.get("/doctor/:id", (req, res) => {
  appointmentController.getDoctorAppointmentList(req, res);
});

router.post("/book", (req, res) => {
  appointmentController.createAppointment(req, res);
});

// router.delete("/cancel", (req, res) => {
//   appointmentController.cancelAppointment(req, res);
// });

export default router;

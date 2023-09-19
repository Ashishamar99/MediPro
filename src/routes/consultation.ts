const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultation");

router.get("/", (req, res) => {
  consultationController.getConsultationList(req, res);
});

router.get("/:id", (req, res) => {
  consultationController.getConsultationWithID(req, res);
});
router.get("/patient/:id", (req, res) => {
  consultationController.getPatientConsultation(req, res);
});
router.get("/doctor/:id", (req, res) => {
  consultationController.getDoctorConsultation(req, res);
});
router.post("/", (req, res) => {
  consultationController.addConsultationInfo(req, res);
});

export default router;

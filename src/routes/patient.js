const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patient");

router.get("/", (req, res) => {
  patientController.getPatientsList(req, res);
});

router.get("/:id", (req, res) => {
  patientController.getPatientWithID(req, res);
});

router.post("/register", (req, res) => {
  patientController.handlePatientRegister(req, res);
});

router.put("/register", (req, res) => {
  patientController.updatePatientRegister(req, res);
});

router.post("/login", (req, res) => {
  patientController.handlePatientLogin(req, res);
});

module.exports = router;

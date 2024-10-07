import express from "express";

import * as patientController from "../controllers/patient";
import { auth } from "../middleware/auth";
const router = express.Router();

router.get("/", auth, (req, res) => {
  void patientController.getPatientsList(req, res);
});

router.put("/", auth, (req, res) => {
  patientController.updatePatientRegister(req, res);
});

router.get("/:id", auth, (req, res) => {
  patientController.getPatientWithID(req, res);
});

router.post("/register", (req, res) => {
  patientController.handlePatientRegister(req, res);
});

router.post("/login", (req, res) => {
  patientController.handlePatientLogin(req, res);
});

export default router;

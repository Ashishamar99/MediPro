const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor");
const multer = require("multer");

let storage = multer.memoryStorage();
let upload = multer({ storage: storage });

router.get("/", (req, res) => {
  doctorController.getDoctorsList(req, res);
});

router.get("/:id", (req, res) => {
  doctorController.getDoctorWithID(req, res);
});

router.get("/get-available-doctors", (req, res) => {
  doctorController.getAvailableDoctors(req, res);
});

router.post("/get-doctor-with-role", (req, res) => {
  doctorController.getDoctorWithRole(req, res);
});

router.post("/register", upload.single("sign-image"), (req, res) => {
  doctorController.handleDoctorRegister(req, res);
});

router.post("/login", (req, res) => {
  doctorController.handleDoctorLogin(req, res);
});

module.exports = router;

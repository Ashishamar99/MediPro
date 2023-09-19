const express = require("express");
const router = express.Router();
const ivrController = require("../controllers/ivr");

router.post("/ivr-request", (req, res) => {
  ivrController.handleIVRRequest(req, res);
});

router.post("/login", (req, res) => {
  ivrController.handleLoginMenu(req, res);
});

router.post("/menu", (req, res) => {
  ivrController.ivrMenu(req, res);
});

router.post("/booking-menu/:id", (req, res) => {
  ivrController.bookingMenu(req, res);
});

router.post("/appointment/:id", (req, res) => {
  ivrController.appointmentMenu(req, res);
});

// router.post("/pidmenu", (req, res) => {
//   ivrController.pidMenu(req, res);
// });

// router.post("/booking", (req, res) => {
//   ivrController.bookingMenu(req, res);
// });
export default router;
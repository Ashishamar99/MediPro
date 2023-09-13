const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/book-appointment");

router.get("/get-slots", (req, res) => {
  bookingController.getSlots(req, res);
});

router.get("/get-available-slots", (req, res) => {
  bookingController.getAvailableSlots(req, res);
});

router.post("/book-slot", (req, res) => {
  bookingController.bookSlot(req, res);
});

router.post("/unblock-slots", (req, res) => {
  bookingController.unblockAllSlots(req, res);
});

module.exports = router;

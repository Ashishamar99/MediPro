import express from "express";
import * as bookingController from "../controllers/slot";
const router = express.Router();

router.get("/", (req, res) => {
  bookingController.getSlots(req, res);
});

router.post("/availability", (req, res) => {
  bookingController.generateSlots(req, res);
});

router.get("/available", (req, res) => {
  bookingController.getAvailableSlots(req, res);
});

router.post("/book", (req, res) => {
  bookingController.bookSlot(req, res);
});

export default router;

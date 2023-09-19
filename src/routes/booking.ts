import express from 'express'
import * as bookingController from '../controllers/book-appointment'
const router = express.Router()

router.get('/get-slots', (req, res) => {
  bookingController.getSlots(req, res)
})

router.get('/get-available-slots', (req, res) => {
  bookingController.getAvailableSlots(req, res)
})

router.post('/book-slot', (req, res) => {
  bookingController.bookSlot(req, res)
})

router.post('/unblock-slots', (req, res) => {
  bookingController.unblockAllSlots(req, res)
})

export default router

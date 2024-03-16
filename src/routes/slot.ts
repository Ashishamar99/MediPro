import express from 'express'
import * as bookingController from '../controllers/slot'
import { auth } from '../middleware/auth'
const router = express.Router()

router.get('/', auth, (req, res) => {
  bookingController.getSlots(req, res)
})

router.get('/available', auth, (req, res) => {
  bookingController.getAvailableSlots(req, res)
})

router.post('/book', auth, (req, res) => {
  bookingController.bookSlot(req, res)
})

export default router

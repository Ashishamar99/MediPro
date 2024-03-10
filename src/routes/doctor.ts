import express from 'express'
import * as doctorController from '../controllers/doctor'
import multer from 'multer'
import { auth } from '../middleware/auth'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.get('/', (req, res) => {
  void doctorController.getDoctorsList(req, res)
})

router.get('/get-available-doctors', auth, (req, res) => {
  doctorController.getAvailableDoctors(req, res)
})

router.get('/:id', auth, (req, res) => {
  void doctorController.getDoctorWithID(req, res)
})

router.delete('/:id', auth, (req, res) => {
  void doctorController.deleteDoctorWithID(req, res)
})

router.post('/get-doctor-with-role', auth, (req, res) => {
  doctorController.getDoctorWithRole(req, res)
})

router.post('/register', upload.single('signature'), (req, res) => {
  void doctorController.handleDoctorRegister(req, res)
})

router.post('/login', (req, res) => {
  doctorController.handleDoctorLogin(req, res)
})

export default router

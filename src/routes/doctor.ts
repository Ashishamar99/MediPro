import express from 'express'
import * as doctorController from '../controllers/doctor'
import multer from 'multer'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.get('/', (req, res) => {
  doctorController.getDoctorsList(req, res)
})

// router.put('/complete', () => {
//   doctorController
// })

router.get('/get-available-doctors', (req, res) => {
  doctorController.getAvailableDoctors(req, res)
})

router.get('/:id', (req, res) => {
  void doctorController.getDoctorWithID(req, res)
})

router.post('/get-doctor-with-role', (req, res) => {
  doctorController.getDoctorWithRole(req, res)
})

router.post('/register', upload.single('sign-image'), (req, res) => {
  doctorController.handleDoctorRegister(req, res)
})

router.post('/login', (req, res) => {
  doctorController.handleDoctorLogin(req, res)
})

export default router

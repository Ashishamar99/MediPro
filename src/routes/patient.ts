import express from 'express'

import * as patientController from '../controllers/patient'
const router = express.Router()

router.get('/', (req, res) => {
  patientController.getPatientsList(req, res)
})

router.get('/:id', (req, res) => {
  patientController.getPatientWithID(req, res)
})

router.post('/register', (req, res) => {
  patientController.handlePatientRegister(req, res)
})

router.put('/register', (req, res) => {
  patientController.updatePatientRegister(req, res)
})

router.post('/login', (req, res) => {
  patientController.handlePatientLogin(req, res)
})

export default router

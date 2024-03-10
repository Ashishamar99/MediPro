import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import patientRouter from './src/routes/patient'
import doctorRouter from './src/routes/doctor'
import bookingRouter from './src/routes/booking'
import consultationRouter from './src/routes/consultation'
import appointmentRouter from './src/routes/appointment'

import logger from './src/logger'
dotenv.config()
const app = express()
const port = process.env.PORT ?? 5002

app.use(cors({ origin: '*' }))
app.use(bodyParser.json({ limit: '5mb' }))

app.get('/health', (_req, res) => {
  res.json({ uptime: process.uptime(), message: 'OK', timestamp: new Date() })
})

app.use('/patient', patientRouter)

app.use('/doctor', doctorRouter)

app.use('/booking', bookingRouter)

app.use('/consultation', consultationRouter)

app.use('/appointment', appointmentRouter)

app.listen(port, () => {
  logger.info(`Application started at port ${port}`)
})

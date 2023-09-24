import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
// import { createClient } from '@supabase/supabase-js'

import patientRouter from './src/routes/patient'
import doctorRouter from './src/routes/doctor'
import bookingRouter from './src/routes/booking'
import consultationRouter from './src/routes/consultation'
import appointmentRouter from './src/routes/appointment'
// import prisma from './src/database/prisma'

import logger from './src/logger'
dotenv.config()
const app = express()
const port = process.env.PORT ?? 5002

// const supabaseUrl = process.env.SUPABASE_URL ?? ''
// const supabaseKey = process.env.SUPABASE_KEY ?? ''

// const supabase = createClient(supabaseUrl, supabaseKey)
// async function uploadFile (): Promise<void> {
//   const { data, error } = await supabase.storage
//     .from(process.env.SUPABASE_BUCKET ?? '') // Replace 'bucket_name' with your actual bucket name
//     .upload('', '', { contentType: 'image/jpeg' })
//   console.log(data)
//   if (error) {
//     console.error('Error uploading file:', error.message)
//   } else {
//     console.log('File uploaded successfully:')

//     const { data } = supabase.storage
//       .from(process.env.SUPABASE_BUCKET ?? '')
//       .getPublicUrl('')
//     console.log(data)
//   }
// }

// uploadFile().then(() => {}).catch(console.log)
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

import moment from 'moment'
import db from '../database/knex'
import prisma from '../database/prisma'

export const getAppointmentList = async (req, res): Promise<void> => {
  return res.json({ data: await prisma.appointment.findMany() })
}

export const getAppointmentForDoctor = async (req, res): Promise<void> => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: {
          select: {
            role: true
          }
        },
        patient: {
          select: {
            name: true
          }
        }
      }
    })

    const data = appointments.map((appointment) => ({
      booking_time: moment(appointment.booking_time).format('MMM Do'),
      patient_name: appointment.patient.name,
      role: appointment.doctor.role,
      end_time: moment(appointment.end_time).format('LT'),
      id: appointment.id,
      patient_id: appointment.patient_id,
      start_time: moment(appointment.start_time).format('LT')
    }))

    return res.json(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const cancelAppointment = (req, res): void => {
  const { bid, slotNo, did } = req.body
  db('appointments')
    .where('bid', bid)
    .del()
    .then(() => {
      db('slots')
        .where({ slot_no: slotNo })
        .update({ isBooked: 0 })
        .then(() => {
          db('doctor')
            .where({ did })
            .update({ isAvailable: 1 })
            .then(() => {
              res.status(200).send('Appointment cancelled!')
            })
            .catch((err) => {
              res.status(400).send("Couldn't cancel appointment")
              console.error(err)
            })
        })
        .catch((err) => {
          res.status(400).send("Couldn't cancel appointment")
          console.error(err)
        })
    })
    .catch((err) => {
      res.send('Internal server error')
      console.error(err)
    })
}

export const getAppointmentWithID = (req, res): void => {
  const bid = req.params.id
  db.select('*')
    .from('appointments')
    .where('bid', '=', bid)
    .then((appointments) => {
      res.status(200).send(appointments)
    })
    .catch((err) => {
      res.send('Unable to get appointment details')
      console.error(err)
    })
}

export const getAppointmentWithPID = (req, res): void => {
  const pid = req.params.id
  db.select('*')
    .from('appointments')
    .where('pid', '=', pid)
    .then((appointments) => {
      res.status(200).send(appointments)
    })
    .catch((err) => {
      res.send('Unable to get appointment details')
      console.error(err)
    })
}

export const getAppointmentWithDID = (req, res): void => {
  const did = req.params.id
  db.select('*')
    .from('appointments')
    .where('did', '=', did)
    .then((appointments) => {
      res.status(200).send(appointments)
    })
    .catch((err) => {
      res.send('Unable to get appointment details')
      console.error(err)
    })
}

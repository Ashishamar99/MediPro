import { createClient } from '@supabase/supabase-js'
import db from '../database/knex'
import prisma from '../database/prisma'

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_KEY ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

export const getDoctorsList = async (req, res): Promise<void> => {
  return res.json({ data: await prisma.doctor.findMany() })
}

export const getDoctorWithID = async (req, res): Promise<void> => {
  const id = req.params.id
  const doctor = await prisma.doctor.findUnique({ where: { id } })
  return res.json({ doctor })
}

export const handleDoctorLogin = (req, res): void => {
  const { phno, password } = req.body
  if (!phno || !password) {
    return res.status(400).json('incorrect form submission')
  }
  db.select('dphno', 'dpasswd')
    .from('doctor')
    .where('dphno', '=', phno)
    .then(async (data) => {
      if (data.length && password.toString() === data[0].dpasswd) {
        await db
          .select('*')
          .from('doctor')
          .where('dphno', '=', phno)
          .then((user) => {
            res.json(user[0])
          })
          .catch((err) => {
            console.error(err)
            res.status(400).json('unable to get user')
          })
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(400).json(err)
    })
}

interface DoctorData {
  id: string
  name: string
  imageUrl: string
  phone: string
  signatureUrl: string
  signatureFilename: string
  role: string
}

const uploadFile = async (filename, buffer): Promise<any> => {
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET ?? '')
    .upload(filename, buffer, { contentType: 'image/png' })
  const { data } = supabase.storage
    .from(process.env.SUPABASE_BUCKET ?? '')
    .getPublicUrl(filename)

  if (error) console.log(error)
  return data
}

export const handleDoctorRegister = async (req, res): Promise<void> => {
  let { user } = req.body
  user = JSON.parse(user)
  const file = req.file
  const FILENAME = `${Date.now().toString()}-${file.originalname}`

  const data = await uploadFile(FILENAME, file.buffer)
  user.signatureUrl = data.publicUrl
  user.signatureFilename = FILENAME

  const doctor: DoctorData = user
  const response = await prisma.doctor.create({ data: doctor })
  return res.json(response)
}

export const getDoctorWithRole = (req, res): void => {
  const role = req.body.role
  db.select('*')
    .from('doctor')
    .where({ role, isAvailable: '1' })
    .then((doctor) => {
      res.status(200).send(doctor[0]) // return only one doctor
    })
    .catch((err) => {
      res.status(400).send('Unable to get user')
      console.error(err)
    })
}

export const getAvailableDoctors = (req, res): void => {
  db.select('*')
    .from('doctor')
    .where({ isAvailable: '1' })
    .then((doctor) => {
      res.status(200).send(doctor)
    })
    .catch((err) => {
      res.status(400).send('Unable to get user')
      console.error(err)
    })
}

export const deleteDoctorWithID = async (req, res): Promise<void> => {
  const id = req.params.id
  const doctor: DoctorData | null = await prisma.doctor.findUnique({ where: { id } })

  if (doctor) {
    await supabase
      .storage
      .from('medipro-signatures')
      .remove([doctor.signatureFilename])
  }

  const data = await prisma.doctor.delete({ where: { id } })
  // const data = await prisma.doctor.deleteMany();
  return res.json({ data })
}

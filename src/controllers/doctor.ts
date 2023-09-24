import { createClient } from '@supabase/supabase-js'
import db from '../database/knex'
import prisma from '../database/prisma'
import { randomUUID } from 'crypto'

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
  id: string;
  signatureUrl: string;
  role: string;
}

async function uploadFile(file, buffer): Promise<any> {
  const supabaseUrl = process.env.SUPABASE_URL ?? ''
  const supabaseKey = process.env.SUPABASE_KEY ?? ''
  const supabase = createClient(supabaseUrl, supabaseKey)
  const FILENAME = `${Date.now().toString()}-${file}`
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET ?? '')
    .upload(FILENAME, buffer, { contentType: 'image/png' })
  console.log('error: ', FILENAME)
  const { data } = supabase.storage
    .from(process.env.SUPABASE_BUCKET ?? '')
    .getPublicUrl(FILENAME);
  console.log('error: ', FILENAME)

  if (error) console.log(error);
  return data;
}

export const handleDoctorRegister = async (req, res): Promise<void> => {
  const { id, role }: { id: string, role: string } = req.body;
  const file = req.file;
  let data = await uploadFile(file.originalname, file.buffer);
  let signatureUrl: string = data.publicUrl
  let doctor: DoctorData = { id, role, signatureUrl }
  console.log({ doctor });
  let response = await prisma.doctor.create({ data: doctor });
  return res.json(response);
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
  const id = req.params.id;
  const data = await prisma.doctor.delete({ where: { id } })
  // const data = await prisma.doctor.deleteMany();
  return res.json({ data });
}
import { createClient } from '@supabase/supabase-js'
import db from '../database/knex'
import prisma from '../database/prisma'

export const getDoctorsList = (req, res): void => {
  db.select('*')
    .from('doctor')
    .then((doctors) => {
      res.status(200).send(doctors)
    })
    .catch((err) => {
      res.status(400).send('Unable to get user')
      console.error(err)
    })
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

  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET ?? '')
    .upload(file, buffer, { contentType: 'image/png' })

  const { data } = supabase.storage
    .from(process.env.SUPABASE_BUCKET ?? '')
    .getPublicUrl(file);

  if (error) console.log(error);
  return data;
}

export const handleDoctorRegister = (req, res): void => {
  const { id, role }: { id: string, role: string } = req.body;
  const file = req.file;
  uploadFile(file.originalname, file.buffer).then((data) => {
    let signatureUrl: string = data.publicUrl
    let doctor: DoctorData = { id, role, signatureUrl }

    prisma.doctor.create({ data: doctor }).then((data) => {
      return res.json(data);
    }).catch(console.log)
  }).catch(console.log)
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

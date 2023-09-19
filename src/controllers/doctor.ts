import db from '../database/knex'

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

export const getDoctorWithID = (req, res): void => {
  const id = req.params.id
  db.select('*')
    .from('doctor')
    .where('did', '=', id)
    .then((doctor) => {
      if (doctor && doctor[0].signature !== null) {
        doctor[0].signature = doctor[0].signature.toString()
      }
      res.status(200).send(doctor)
    })
    .catch((err) => {
      res.status(400).send('Unable to get user')
      console.error(err)
    })
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

export const handleDoctorRegister = (req, res): void => {
  const { name, phno, email, password, role, signature } = req.body
  db.transaction(async function (trx) {
    const doctor = {
      dname: name,
      dpasswd: password,
      demail: email,
      dphno: phno,
      role: role.toLowerCase(),
      signature
    }

    await trx
      .insert(doctor)
      .into('doctor')
      .then((id) => {
        // trx.commit
        res.status(200).send(id)
      })
      .catch((err) => {
        // trx.rollback
        res.status(400).send('User already exists')
        console.error(err)
      })
  }).catch(function (err) {
    res.status(400).send('unable to register')
    console.error(err)
  })
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

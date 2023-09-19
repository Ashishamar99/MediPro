import db from '../database/knex'

export const handlePatientRegister = (req, res): void => {
  const { name, phno, gender, email, dob, password } = req.body
  db.transaction(async function (trx) {
    const patient = {
      pname: name,
      ppasswd: password,
      pemail: email,
      pphno: phno,
      dob,
      gender
    }

    await trx
      .insert(patient)
      .into('patient')
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
    res.status(500).json({ status: 'ERROR', message: 'Internal server error' })
    console.error(err)
  })
}

export const updatePatientRegister = (req, res): void => {
  const { pname, pid, pphno, gender, dob } = req.body
  const patient = {
    pname,
    pphno,
    dob,
    gender
  }
  db('patient')
    .where('pid', pid)
    .update(patient)
    .then((isUpdated) => {
      if (isUpdated === 1) {
        res.status(200).send('Update successful!')
        return
      }
      res.status(404).send('Incorrect PID')
    })
    .catch((err) => {
      // trx.rollback;
      res.status(400).send("User doesn't exist")
      console.error(err)
    })
}

export const handlePatientLogin = (req, res): void => {
  const { phno, password } = req.body

  if (!phno || !password) {
    return res.status(400).json('incorrect form submission')
  }
  db.select('pphno', 'ppasswd')
    .from('patient')
    .where('pphno', '=', phno)
    .then(async (data) => {
      if (password.toString() === data[0].ppasswd) {
        return await db
          .select('*')
          .from('patient')
          .where('pphno', '=', phno)
          .then((user) => {
            res.json(user[0])
          })
          .catch(() => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch((err) => res.status(400).json(err))
}

export const getPatientsList = (req, res): void => {
  db.select('*')
    .from('patient')
    .then((patients) => {
      res.status(200).send(patients)
    })
    .catch((err) => {
      res
        .status(500)
        .json({ status: 'ERROR', message: 'Internal server error' })
      console.error(err)
    })
}

export const getPatientWithID = (req, res): void => {
  const id = req.params.id
  db.select('*')
    .from('patient')
    .where('pid', '=', id)
    .then((patient) => {
      res.status(200).send(patient)
    })
    .catch((err) => {
      res.status(400).send('Unable to get user')
      console.error(err)
    })
}

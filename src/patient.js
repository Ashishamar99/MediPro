const handlePatientRegister = (req, res, db) => {
  const { name, phno, gender, email, dob, password } = req.body;
  db.transaction(function (trx) {
    const patient = {
      pname: name,
      ppasswd: password,
      pemail: email,
      pphno: phno,
      dob: dob,
      gender: gender,
    };

    return trx
      .insert(patient)
      .into("patient")
      .then((id) => {
        trx.commit;
        res.status(200).send(id);
      })
      .catch((err) => {
        trx.rollback;
        res.status(400).send("User already exists");
        console.error(err);
      });
  }).catch(function (err) {
    res.status(400).send("unable to register");
    console.error(err);
  });
};

const updatePatientRegister = (req, res, db) => {
  const { pname, pid, pphno, gender, dob } = req.body;
  const patient = {
    pname: pname,
    pphno: pphno,
    dob: dob,
    gender: gender,
  };
  db("patient")
    .where("pid", pid)
    .update(patient)
    .then(() => {
      res.status(200).send("Update successful!");
    })
    .catch((err) => {
      //trx.rollback;
      res.status(400).send("User doesn't exist");
      console.error(err);
    });
};

const handlePatientLogin = (req, res, db) => {
  const { phno, password } = req.body;

  if (!phno || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("pphno", "ppasswd")
    .from("patient")
    .where("pphno", "=", phno)
    .then((data) => {
      if (password.toString() === data[0].ppasswd) {
        return db
          .select("*")
          .from("patient")
          .where("pphno", "=", phno)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json(err));
};

const getPatientsList = (req, res, db) => {
  db.select("*")
    .from("patient")
    .then((patients) => {
      res.status(200).send(patients);
    })
    .catch((err) => {
      res.status(400).send("Unable to get users");
      console.error(err);
    });
};

const getPatientWithID = (req, res, db) => {
  const id = req.params.id;
  db.select("*")
    .from("patient")
    .where("pid", "=", id)
    .then((patient) => {
      res.status(200).send(patient);
    })
    .catch((err) => {
      res.status(400).send("Unable to get user");
      console.error(err);
    });
};

module.exports = {
  handlePatientRegister: handlePatientRegister,
  handlePatientLogin: handlePatientLogin,
  getPatientsList: getPatientsList,
  getPatientWithID: getPatientWithID,
  updatePatientRegister: updatePatientRegister,
};

const db = require("../database/knex");

const getDoctorsList = (req, res) => {
  db.select("*")
    .from("doctor")
    .then((doctors) => {
      res.status(200).send(doctors);
    })
    .catch((err) => {
      res.status(400).send("Unable to get user");
      console.error(err);
    });
};

const getDoctorWithID = (req, res) => {
  const id = req.params.id;
  db.select("*")
    .from("doctor")
    .where("did", "=", id)
    .then((doctor) => {
      if (doctor && doctor[0].signature !== null) {
        doctor[0].signature = doctor[0].signature.toString();
      }
      res.status(200).send(doctor);
    })
    .catch((err) => {
      res.status(400).send("Unable to get user");
      console.error(err);
    });
};

const handleDoctorLogin = (req, res) => {
  const { phno, password } = req.body;
  if (!phno || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("dphno", "dpasswd")
    .from("doctor")
    .where("dphno", "=", phno)
    .then((data) => {
      if (data.length && password.toString() === data[0].dpasswd) {
        return db
          .select("*")
          .from("doctor")
          .where("dphno", "=", phno)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => {
            console.error(err);
            res.status(400).json("unable to get user");
          });
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
};

const handleDoctorRegister = (req, res) => {
  const { name, phno, email, password, role, signature } = req.body;
  db.transaction(function (trx) {
    const doctor = {
      dname: name,
      dpasswd: password,
      demail: email,
      dphno: phno,
      role: role.toLowerCase(),
      signature: signature,
    };

    return trx
      .insert(doctor)
      .into("doctor")
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

const getDoctorWithRole = (req, res) => {
  const role = req.body.role;
  db.select("*")
    .from("doctor")
    .where({ role: role, isAvailable: "1" })
    .then((doctor) => {
      res.status(200).send(doctor[0]); //return only one doctor
    })
    .catch((err) => {
      res.status(400).send("Unable to get user");
      console.error(err);
    });
};

const getAvailableDoctors = (req, res) => {
  db.select("*")
    .from("doctor")
    .where({ isAvailable: "1" })
    .then((doctor) => {
      res.status(200).send(doctor);
    })
    .catch((err) => {
      res.status(400).send("Unable to get user");
      console.error(err);
    });
};

module.exports = {
  getDoctorWithID: getDoctorWithID,
  getDoctorsList: getDoctorsList,
  handleDoctorLogin: handleDoctorLogin,
  handleDoctorRegister: handleDoctorRegister,
  getDoctorWithRole: getDoctorWithRole,
  getAvailableDoctors: getAvailableDoctors,
};

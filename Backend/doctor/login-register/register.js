const handleDoctorRegister = (req, res, db) => {
  const { name, phno, email, password } = req.body;
  db.transaction(function (trx) {
    const doctor = {
      dname: name,
      dpasswd: password,
      demail: email,
      dphno: phno,
    };

    return trx.insert(doctor).into("doctor");
  })
    .then(function () {
      res.status(200).send("Registration successful!");
    })
    .catch(function (err) {
      res.status(400).send("unable to register");
      console.log(err);
    });
};

module.exports = {
  handleDoctorRegister: handleDoctorRegister,
};

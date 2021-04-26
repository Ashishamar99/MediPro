const handleRegister = (req, res, db) => {
  const { name, phno, email, dob, password  } = req.body;
  const did = null;
  db
    .transaction(function (trx) {
      const patient = {
        pname: name,
        ppasswd: password,
        pemail: email,
        pphno: phno,
        dob: dob,
        did: did,
      };

      return trx
        .insert(patient)
        .into("patient")
    })
    .then(function () {
      res.status(200).send("Registration successful!");
    })
    .catch(function (err) {
      res.status(404).send("unable to register");
      console.log(err);
    });
};

module.exports = {
  handleRegister: handleRegister,
};

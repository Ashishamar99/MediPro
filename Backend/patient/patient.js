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
  getPatientsList: getPatientsList,
  getPatientWithID: getPatientWithID,
};
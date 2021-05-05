const getDoctorsList = (req, res, db) => {
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

const getDoctorWithID = (req, res, db) => {
  const id = req.params.id;
  db.select("*")
    .from("doctor")
    .where("did", "=", id)
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
};

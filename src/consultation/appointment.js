const getAppointmentList = (req, res, db) => {
  db.select("*")
    .from("appointments")
    .then((appointments) => {
      res.status(200).send(appointments);
    })
    .catch((err) => {
      res.send("Unable to get appointment details");
      console.error(err);
    });
};

const getAppointmentWithID = (req, res, db) => {
  const bid = req.params.id;
  db.select("*")
    .from("appointments")
    .where("bid", "=", bid)
    .then((appointments) => {
      res.status(200).send(appointments);
    })
    .catch((err) => {
      res.send("Unable to get appointment details");
      console.error(err);
    });
};

const getAppointmentWithPID = (req, res, db) => {
  const pid = req.params.id;
  db.select("*")
    .from("appointments")
    .where("pid", "=", pid)
    .then((appointments) => {
      res.status(200).send(appointments);
    })
    .catch((err) => {
      res.send("Unable to get appointment details");
      console.error(err);
    });
};

module.exports = {
  getAppointmentList: getAppointmentList,
  getAppointmentWithID: getAppointmentWithID,
  getAppointmentWithPID: getAppointmentWithPID,
};

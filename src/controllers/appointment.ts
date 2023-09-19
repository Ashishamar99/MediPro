import db from "../database/knex";

export const getAppointmentList = (req, res) => {
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

export const cancelAppointment = (req, res) => {
  const { bid, slotNo, did } = req.body;
  db("appointments")
    .where("bid", bid)
    .del()
    .then(() => {
      db("slots")
        .where({ slot_no: slotNo })
        .update({ isBooked: 0 })
        .then(() => {
          db("doctor")
            .where({ did: did })
            .update({ isAvailable: 1 })
            .then(() => {
              res.status(200).send("Appointment cancelled!");
            })
            .catch((err) => {
              res.status(400).send("Couldn't cancel appointment");
              console.error(err);
            });
        })
        .catch((err) => {
          res.status(400).send("Couldn't cancel appointment");
          console.error(err);
        });
    })
    .catch((err) => {
      res.send("Internal server error");
      console.error(err);
    });
};

export const getAppointmentWithID = (req, res) => {
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

export const getAppointmentWithPID = (req, res) => {
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

export const getAppointmentWithDID = (req, res) => {
  const did = req.params.id;
  db.select("*")
    .from("appointments")
    .where("did", "=", did)
    .then((appointments) => {
      res.status(200).send(appointments);
    })
    .catch((err) => {
      res.send("Unable to get appointment details");
      console.error(err);
    });
};


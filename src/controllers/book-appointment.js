const dateTime = require("moment");
const db = require("../database/knex");

const getSlots = (req, res) => {
  //returns all slots (including booked slots)
  db.select()
    .from("slots")
    .then((slotArr) => {
      res.status(200).send(slotArr);
    })
    .catch((err) => res.status(400).send(err));
};

const getAvailableSlots = (req, res) => {
  //returns all available slots for booking (i.e., isBooked = 0)
  db.select()
    .from("slots")
    .then((slotArr) => {
      let result = [];
      slotArr.map((slot) => {
        if (slot.isBooked == 0) {
          result.push(slot);
        }
      });
      res.status(200).send(result);
    })
    .catch((err) => res.status(400).send(err));
};

const bookSlot = (req, res) => {
  //get slot details for given slot number
  const { slotNo, pid, did } = req.body;
  db("slots")
    .where({ slot_no: slotNo, isBooked: 0 })
    .then((slotArr) => {
      db("doctor")
        .where({ isAvailable: 1 })
        .then((doc) => {
          if (!slotArr.length || !doc.length) {
            res.status(400).send("Slot unavailable");
          } else {
            let slotDetails = slotArr[0];
            let startTime = slotDetails.slot_start;
            let endTime = slotDetails.slot_end;

            return (
              db("appointments")
                .insert({
                  booking_date: dateTime().format("YYYY-MM-DD"), //assuming booking only for current day
                  start_time: startTime,
                  end_time: endTime,
                  slot_no: slotNo,
                  pid: pid,
                  did: did,
                })

                //update available slots and doctor availability
                .then(() => {
                  db("slots")
                    .where({ slot_no: slotNo })
                    .update({ isBooked: 1 })
                    .then(() => {
                      db("doctor")
                        .where({ did: did })
                        .update({ isAvailable: 0 })
                        .then(() => {
                          res.status(200).send("Booking successful");
                        })
                        .catch((err) => {
                          res.status(400).send("Couldn't book appointment");
                          console.error(err);
                        });
                    })
                    .catch((err) => {
                      res.status(400).send("Couldn't book appointment");
                      console.error(err);
                    });
                })
                .catch((err) => {
                  res.status(500).send("Couldn't book appointment");
                  console.error(err);
                })
            );
          }
        });
    })
    .catch(function (err) {
      res.status(500).send("unable to register");
      console.error(err);
    });
};

const unblockAllSlots = (req, res) => {
  const { did } = req.body;
  db("doctor")
    .select("did")
    .where("did", did)
    .then((doc) => {
      if (!doc.length) {
        res.status(400).send("Action unauthorized");
      }
    });
  db("slots")
    .update({ isBooked: 0 })
    .then(() => {
      db("doctor")
        .update({ isAvailable: 1 })
        .then(() => {
          db("appointments")
            .del()
            .then(() => {
              res.status(200).send("slots and doctors Unblock successful");
            });
        })
        .catch((err) => {
          res.status(500).send("Couldn't unblock slots and doctors");
          console.error(err);
        });
    })
    .catch((err) => {
      res.status(500).send("Couldn't unblock slots and doctors");
      console.error(err);
    });
};

module.exports = {
  getSlots: getSlots,
  getAvailableSlots: getAvailableSlots,
  bookSlot: bookSlot,
  unblockAllSlots: unblockAllSlots,
};

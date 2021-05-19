const dateTime = require("moment");

const getSlots = (req, res, db) => {
  //returns all slots (including booked slots)
  db.select()
    .from("slots")
    .then((slotArr) => {
      res.status(200).send(slotArr);
    })
    .catch((err) => res.status(400).send(err));
};

const getAvailableSlots = (req, res, db) => {
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

const bookSlot = (req, res, db) => {
  //get slot details for given slot number
  const { slotNo, pid, did } = req.body;

  db("slots")
    .where({ slot_no: slotNo, isBooked: 0 })
    .then((slotArr) => {
      if (!slotArr.length) {
        res.status(400).send("Slot unavailable");
      } else {
        let slotDetails = slotArr[0];
        let startTime = slotDetails.slot_start;
        let endTime = slotDetails.slot_end;

        //insert slot details into appointment table
        db("appointments")
          .insert({
            booking_date: dateTime().format("YYYY-MM-DD"), //assuming booking only for current day
            start_time: startTime,
            end_time: endTime,
            slot_no: slotNo,
            pid: pid,
            did: did,
          })
          //update available slots
          .then(
            db("slots")
              .where("slot_no", "=", slotNo)
              .update({ isBooked: 1 })
              .then(() => {
                res.status(200).send("Booking successful");
              })
          );
      }
    })
    .catch((err) => {
      res.send(err);
    });
};

const unblockAllSlots = (req, res, db) => {
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
      res.status(200).send("Unblock successful");
    })
    .catch((err) => {
      res.status(500).send("Couldn't unblock slots");
      console.error(err);
    });
};

module.exports = {
  getSlots: getSlots,
  getAvailableSlots: getAvailableSlots,
  bookSlot: bookSlot,
  unblockAllSlots: unblockAllSlots,
};

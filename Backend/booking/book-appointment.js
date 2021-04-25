const dateTime = require("moment");
const getAvailableSlots = (req, res, db) => {
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

  const slotNo = req.body.slotNo;
  const pid = req.body.pid;
  db("slots")
    .where("slot_no", slotNo)
    .then((slotArr) => {
      let slotDetails = slotArr[0];
      let startTime = slotDetails.slot_start;
      let endTime = slotDetails.slot_end;

      //insert slot details into appointment table
      db("appointments")
        .insert({
          booking_date: dateTime().format("YYYY-MM-DD"),
          start_time: startTime,
          end_time: endTime,
          slot_no: slotNo,
          pid: pid,
        })
        //update available slots
        .then(
          db("slots")
            .where("slot_no", "=", slotNo)
            .update({ isBooked: 1 })
            .then((resp) => {
              res.send(JSON.stringify(resp));
            })
        );
    })
    .catch((err) => {
      res.send(err);
    });

};

module.exports = {
  getAvailableSlots: getAvailableSlots,
  bookSlot: bookSlot,
};

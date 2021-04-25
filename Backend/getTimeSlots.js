const dateTime = require("moment");
const startTime = dateTime().add(1, "hour");
const endTime = dateTime("16:00", "hh:mm");
startTime.startOf("hour").format("hh:mm:ss");

let slotsArr = [];
let slotNo = 1;

while (startTime <= endTime) {
  slotStart = startTime.format("hh:mm A");
  slotEnd = startTime.add(1, "hour").format("hh:mm A");
   slotsArr.push({
     slotNo: slotNo,
     slotTime: { slotStart: slotStart, slotEnd: slotEnd },
     isBooked: false,
   });
  slotNo += 1;
}

module.exports = {
    slotsArr
}

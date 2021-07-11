const dateTime = require("moment");
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const querystring = require("querystring");

const bookingMenu = (req, res, db) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", function () {
    let enteredDigit = parseInt(querystring.parse(body).Digits);
    let pid = req.params.id;
    handleBookingMenu(enteredDigit, pid, res, db);
  });
};

const handleBookingMenu = (digit, pid, res, db) => {
  if (digit === 1) {
    //get slots`
    console.log("Getting available slots...");
    handleBooking(pid, res, db);
  } else if (digit === 2) {
    //get recent consultation
    console.log("Getting consultation details...");
  }
};

const appointmentMenu = (req, res, db) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", function () {
    let enteredDigit = parseInt(querystring.parse(body).Digits);
    let pid = req.params.id;
    handleAppointment(enteredDigit, pid, res, db);
  });
};

const handleAppointment = (digit, pid, res, db) => {
  const fields = [
    "General",
    "Gynecologist",
    "Neurosurgeon",
    "Psychiatrist",
    "Dental",
  ];
  let bookingField = fields[digit - 1];
  console.log("bookingField: ", bookingField);
  let did = "";
  db.select("*")
    .from("doctor")
    .where({ isAvailable: "1", role: bookingField })
    .then((doctor) => {
      did = doctor[0].did;
      let vr = new VoiceResponse();
      let result = [];
      db.select()
        .from("slots")
        .then((slotArr) => {
          slotArr.map((slot) => {
            if (slot.isBooked == 0) {
              result.push(slot);
            }
          });

          if (result && result.length) {
            let slot_no = result[0].slot_no;

            db("slots")
              .where({ slot_no: slot_no, isBooked: 0 })
              .then((slotArr) => {
                db("doctor")
                  .where({ isAvailable: 1 })
                  .then((doc) => {
                    if (!slotArr.length || !doc.length) {
                      vr.say("Sorry, No slots available at this moment");
                      res.send(vr.toString()); //new
                    } else {
                      let slotDetails = slotArr[0];
                      let startTime = slotDetails.slot_start;
                      let endTime = slotDetails.slot_end;

                      return (
                        db("appointments")
                          .insert({
                            booking_date: dateTime().format("YYYY-MM-DD"),
                            start_time: startTime,
                            end_time: endTime,
                            slot_no: slot_no,
                            pid: pid,
                            did: did,
                          })

                          //update available slots and doctor availability
                          .then(() => {
                            db("slots")
                              .where({ slot_no: slot_no })
                              .update({ isBooked: 1 })
                              .then(() => {
                                console.log("Success");
                                db("doctor")
                                  .where({ did: did })
                                  .update({ isAvailable: 0 })
                                  .then(() => {
                                    vr.say(
                                      `Booking successful, appointment at ${startTime}, details of booking will be shared to this number.`
                                    );
                                    res.send(vr.toString());
                                  })
                                  .catch((err) => {
                                    // vr.say("Couldn't book appointment");
                                    console.error(err);
                                  });
                              })
                              .catch((err) => {
                                console.error(err);
                              });
                          })
                          .catch((err) => {
                            console.error(err);
                          })
                      );
                    }
                  });
              })
              .catch(function (err) {
                console.error(err);
              });
          }
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

const handleBooking = (pid, res, db) => {
  const voiceResponse = new VoiceResponse();
  const gather = voiceResponse.gather({
    action: `/ivr/appointment/${pid}`,
    numDigits: "1",
    method: "POST",
  });

  const fields = [
    "General",
    "Gynecologist",
    "Neurosurgeon",
    "Psychiatrist",
    "Dental",
  ];
  let msg = "";
  for (let i = 0; i < fields.length; i++) {
    msg += `To book an appointment for ${fields[i]} press ${i + 1} \n`;
  }
  gather.say(msg, { loop: 2 });
  res.type("text/xml");
  res.send(voiceResponse.toString());
};

const handlePatientRegister = (res, db) => {
  db.insert({
    pname: null,
    ppasswd: null,
    pemail: null,
    pphno: null,
    dob: null,
    gender: null,
  })
    .into("patient")
    .then((pid) => {
      let id = String(pid);
      let msg = `Registration successful, You're P I D is ${id}.`;
      let twiml = new VoiceResponse();
      twiml.say(msg);

      const gather = twiml.gather({
        action: `/ivr/booking-menu/${id}`,
        numDigits: "1",
        method: "POST",
      });

      gather.say(
        "To book an appointment press 1. To hear previous consultation details press 2.",
        { loop: 2 }
      );

      res.type("text/xml");
      res.send(twiml.toString());
    })
    .catch((err) => {
      console.error(err);
    });
};

// <--------------------------------------------------->
const greetUser = (digit, res, db) => {
  const twiml = new VoiceResponse();
  if (digit === 1) {
    twiml.say("You are an existing user");
    //handle login
  } else if (digit === 2) {
    handlePatientRegister(res, db, twiml);
    // twiml.hangup();
    // twiml.say("Registration successful!");

    // const gather = twiml.gather({
    //   action: "/ivr/booking-menu",
    //   numDigits: "1",
    //   method: "POST",
    // });

    // gather.say(
    //   "To book an appointment press 1. To hear previous consultation details press 2.",
    //   { loop: 2 }
    // );
    // res.type("text/xml");
    // res.send(twiml.toString());
  }
};

// <--------------------------------------------------->
const ivrMenu = (req, res, db) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", function () {
    let enteredDigit = parseInt(querystring.parse(body).Digits);
    greetUser(enteredDigit, res, db);
  });
  res.type("text/xml");
};

const handleIVRRequest = (req, res, db) => {
  const voiceResponse = new VoiceResponse();
  voiceResponse.say({ loop: 1 }, "Welcome to voice based e-prescription");
  const gather = voiceResponse.gather({
    action: "/ivr/menu",
    numDigits: "1",
    // timeout: 5,
    method: "POST",
  });

  gather.say(
    "Please press 1 if you're an existing user. Press 2 if you're a new user",
    { loop: 2 }
  );
  res.type("text/xml");
  res.send(voiceResponse.toString());
};
// <--------------------------------------------------->

module.exports = {
  ivrMenu: ivrMenu,
  handleIVRRequest: handleIVRRequest,
  bookingMenu: bookingMenu,
  appointmentMenu: appointmentMenu,
};

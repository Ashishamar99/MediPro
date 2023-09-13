const dateTime = require("moment");
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const querystring = require("querystring");
const db = require("../database/knex");

const getNumberCallSendSMS = (message) => {
  var number = "";
  const authToken = process.env.SMS_AUTH_TOKEN;
  const accountSid = process.env.SMS_ACCOUNT_SID;

  const client = require("twilio")(accountSid, authToken);

  client.calls.list({ limit: 1 }).then((calls) =>
    calls.forEach((c) => {
      console.log(c);
      number = c.from.slice(3);
      //send SMS now
      sendSMS(message, number);
    })
  );
};

const sendSMS = (message, number) => {
  var unirest = require("unirest");

  var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
  req.query({
    authorization: process.env.SMS_AUTHORIZATION,
    sender_id: "TXTIND",
    message: message,
    route: "v3",
    numbers: number,
  });

  req.headers({
    "cache-control": "no-cache",
  });

  req.end(function (res) {
    if (res.error) throw new Error(res.error);
    console.log(res.body);
  });
};

const bookingMenu = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", function () {
    let enteredDigit = parseInt(querystring.parse(body).Digits);
    let pid = req.params.id;
    handleBookingMenu(enteredDigit, pid, res);
  });
};

const handleBookingMenu = (digit, pid, res) => {
  if (digit === 1) {
    //get slots`
    handleBooking(pid, res);
  } else if (digit === 2) {
    handleConsultation(pid, res);
    //get recent consultation
  }
};

const appointmentMenu = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", function () {
    let enteredDigit = parseInt(querystring.parse(body).Digits);
    let pid = req.params.id;
    handleAppointment(enteredDigit, pid, res);
  });
};

const handleAppointment = (digit, pid, res) => {
  const fields = [
    "General",
    "Gynecologist",
    "Neurosurgeon",
    "Psychiatrist",
    "Dental",
  ];
  let bookingField = fields[digit - 1];
  let did = "";
  db.select("*")
    .from("doctor")
    .where({ isAvailable: "1", role: bookingField })
    .then((doctor) => {
      let vr = new VoiceResponse();
      if (!doctor.length) {
        vr.say("No doctor available", { voice: "Polly.Aditi" });
        res.send(vr.toString());
      } else {
        did = doctor[0].did;
        dname = doctor[0].dname;
        dphno = doctor[0].dphno;
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
                        vr.say("Sorry, No slots available at this moment", {
                          voice: "Polly.Aditi",
                        });
                        res.send(vr.toString());
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
                                        `Your Booking for ${bookingField} is successful, appointment at ${dateTime(
                                          startTime,
                                          "hh:mm a"
                                        ).format(
                                          "LT"
                                        )}, details of booking will be shared to you through SMS.`,
                                        { voice: "Polly.Aditi" }
                                      );
                                      getNumberCallSendSMS(
                                        `Your Booking for ${bookingField} is successful, appointment at ${dateTime(
                                          startTime,
                                          "hh:mm a"
                                        ).format(
                                          "LT"
                                        )}. Contact doctor ${dname} \n Phno: ${dphno}`
                                      );
                                      res.send(vr.toString());
                                    })
                                    .catch((err) => {
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
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const handleBooking = (pid, res) => {
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
  gather.say(msg, { loop: 2, voice: "Polly.Aditi" });
  res.type("text/xml");
  res.send(voiceResponse.toString());
};

const handleConsultation = (pid, res) => {
  const vr = new VoiceResponse();
  db("consultations")
    .where({ pid: pid })
    .then((data) => {
      if (data && data.length) {
        vr.say(
          `Playing your most recent consultation done on ${dateTime(
            data[0].cdatetime
          ).format("MMMM Do YYYY")}`,
          { voice: "Polly.Aditi" }
        );
        vr.say(data[0].audio, { voice: "Polly.Aditi" });
        vr.hangup();
        res.send(vr.toString());
      } else {
        vr.say(`No consultation data found for P I D ${pid}`, {
          voice: "Polly.Aditi",
        });
        vr.hangup();
        res.send(vr.toString());
      }
    });
};

const handlePatientRegister = (res) => {
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
      twiml.say(msg, { voice: "Polly.Aditi" });
      getNumberCallSendSMS(msg);

      const gather = twiml.gather({
        action: `/ivr/booking-menu/${id}`,
        numDigits: "1",
        method: "POST",
      });

      gather.say("To book an appointment press 1", {
        loop: 2,
        voice: "Polly.Aditi",
      });
      res.type("text/xml");
      res.send(twiml.toString());
    })
    .catch((err) => {
      console.error(err);
    });
};

const handleLoginMenu = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", function () {
    let id = parseInt(querystring.parse(body).Digits);
    let twiml = new VoiceResponse();
    const gather = twiml.gather({
      action: `/ivr/booking-menu/${id}`,
      numDigits: "1",
      method: "POST",
    });

    db.select("pname")
      .from("patient")
      .where({ pid: id })
      .then((data) => {
        if (data && data.length) {
          gather.say(
            `Welcome ${data[0].pname}, To book an appointment press 1. To hear previous consultation details press 2.`,
            { loop: 2, voice: "Polly.Aditi" }
          );

          res.type("text/xml");
          res.send(twiml.toString());
        } else {
          twiml.say(
            `No user found for P I D ${id}. Please check the P I D and try again`,
            { voice: "Polly.Aditi" }
          );
          twiml.hangup();
          res.type("text/xml");
          res.send(twiml.toString());
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
};

const handlePatientLogin = (res) => {
  let twiml = new VoiceResponse();

  const gather = twiml.gather({
    action: "/ivr/login",
    timeout: 2,
    method: "POST",
  });

  gather.say("Please enter your P I D.", { loop: 2, voice: "Polly.Aditi" });

  res.type("text/xml");
  res.send(twiml.toString());
};

// <--------------------------------------------------->
const greetUser = (digit, res) => {
  const twiml = new VoiceResponse();
  if (digit === 1) {
    handlePatientLogin(res, twiml);
  } else if (digit === 2) {
    handlePatientRegister(res, twiml);
  }
};

// <--------------------------------------------------->
const ivrMenu = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", function () {
    let enteredDigit = parseInt(querystring.parse(body).Digits);
    greetUser(enteredDigit, res);
  });
  res.type("text/xml");
};

const handleIVRRequest = (req, res) => {
  const voiceResponse = new VoiceResponse();
  voiceResponse.say(
    { loop: 1, voice: "Polly.Aditi" },
    "Welcome to voice based e-prescription"
  );
  const gather = voiceResponse.gather({
    action: "/ivr/menu",
    numDigits: "1",
    // timeout: 5,
    method: "POST",
  });

  gather.say(
    "Please press 1 if you're an existing user. Press 2 if you're a new user",
    { loop: 2, voice: "Polly.Aditi" }
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
  handleLoginMenu: handleLoginMenu,
  sendSMS: sendSMS,
};

const VoiceResponse = require("twilio").twiml.VoiceResponse;
const querystring = require("querystring");

const getNumberCallSendSMS = (message) => {

  var number = '';

  // const accountSid = 'ACbe11bf5856751706836158a633466d34';
  // const authToken = 'be9b03f0f05a990d887617b1179de152';
  const authToken = 'e3b785ff7152aac168b4a15dbd369f02';
  const accountSid = 'AC215b45eb4eda26670a9e4f221311be6e';

  const client = require("twilio")(accountSid, authToken);

  client.calls.list({limit: 1})
    .then(calls => calls.forEach(c => {
      console.log(c);
      // console.log(`Time = ${c.dateUpdated}, From = ${c.from}`);

      number = c.from.slice(3);
      //send SMS now
      sendSMS(message, number);
      }));

}

const sendSMS = (message, number) => {

  
  var unirest = require("unirest");

var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");

req.query({
  "authorization": "B9Hy6Fvs3dJUo2cj175PeGOkKEA4TiVNLMWrq0XRhwZl8uCIQYOVePXyYrE6JMbj41iUHvR5owIWsh7x",
  "sender_id": "TXTIND",
  "message": message,
  "route": "v3",
  "numbers": number
});

req.headers({
  "cache-control": "no-cache"
});


req.end(function (res) {
  if (res.error) throw new Error(res.error);

  console.log(res.body);
});
  
}

const bookingMenu = (req, res, db) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", function () {
    let enteredDigit = parseInt(querystring.parse(body).Digits);
    console.log(enteredDigit);
    bookAppointment(enteredDigit, res, db);
  });
  res.type("text/xml");
};

const handleBookingMenu = (digit, pid, res, db) => {
  if (digit === 1) {
    //get slots`
    handleBooking(pid, res, db);
  } else if (digit === 2) {
    handleConsultation(pid, res, db);
    //get recent consultation
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
                      vr.say({voice: 'Polly.Aditi'},"Sorry, No slots available at this moment");
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
                                      {voice: 'Polly.Aditi'},
                                      `Your Booking for ${bookingField} is successful, appointment at ${dateTime(
                                        startTime,
                                        "hh:mm a"
                                      ).format(
                                        "LT"
                                      )}, details of booking will be shared to you through SMS.`
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
  gather.say({voice: 'Polly.Aditi'}, msg, { loop: 2 });
  res.type("text/xml");
  res.send(phone.toString());
};

const handleConsultation = (pid, res, db) => {
  const vr = new VoiceResponse();
  db("consultations")
    .where({ pid: pid })
    .then((data) => {
      if (data && data.length) {
        vr.say({voice: 'Polly.Aditi'}, 
          `Playing your most recent consultation done on ${dateTime(
            data[0].cdatetime
          ).format("MMMM Do YYYY")}`
        );
        vr.say({voice: 'Polly.Aditi'}, data[0].audio);
        vr.hangup();
        res.send(vr.toString());
      } else {
        vr.say({voice: 'Polly.Aditi'}, `No consultation data found for P I D ${pid}`);
        vr.hangup();
        res.send(vr.toString());
      }
    });
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
      twiml.say({voice: 'Polly.Aditi'}, msg);

      getNumberCallSendSMS(msg);

      const gather = twiml.gather({
        action: `/ivr/booking-menu/${id}`,
        numDigits: "1",
        method: "POST",
      });

      gather.say({voice: 'Polly.Aditi'}, "To book an appointment press 1", { loop: 2 });

  } else if (digit === 2) {
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
        id = String(pid);
        var msg = `Registration successful, You're P I D is ${id}.`;
        twiml.say(msg);
        twiml.hangup();

    db.select("pname")
      .from("patient")
      .where({ pid: id })
      .then((data) => {
        if (data && data.length) {
          gather.say(
            {voice: 'Polly.Aditi'},
            `Welcome ${data[0].pname}, To book an appointment press 1. To hear previous consultation details press 2.`,
            { loop: 2 }
          );

          res.type("text/xml");
          res.send(twiml.toString());
        } else {
          twiml.say(
            {voice: 'Polly.Aditi'},
            `No user found for P I D ${id}. Please check the P I D and try again`
          );
          twiml.hangup();
          res.type("text/xml");
          res.send(twiml.toString());
        }
      });
  });
};

const handlePatientLogin = (res, db) => {
  let twiml = new VoiceResponse();

  const gather = twiml.gather({
    action: "/ivr/login",
    timeout: 5,
    method: "POST",
  });

  gather.say({voice: 'Polly.Aditi'}, "Please enter your P I D.", { loop: 2 });

    // console.log(msg);
    // twiml.say("");
    // twiml.say("You are a new user."); //generate PID, respond with PID -> booking, listen pres
  }
};

const ivrMenu = (req, res, db) => {
  var body = "";
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
  voiceResponse.say({ loop: 1,
    voice: 'Polly.Aditi'}, "Welcome to voice based e-prescription");
  const gather = voiceResponse.gather({
    action: "/ivr/menu",
    numDigits: "1",
    // timeout: 5,
    method: "POST",
  });

  gather.say(
    {voice: 'Polly.Aditi'},
    "Please press 1 if you're an existing user. Press 2 if you're a new user",
    { loop: 2 }
  );
  res.type("text/xml");
  res.send(voiceResponse.toString());
};

module.exports = {
  ivrMenu: ivrMenu,
  handleIVRRequest: handleIVRRequest,
  pidMenu: pidMenu,
  getPID: getPID,
};

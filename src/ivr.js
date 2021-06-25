const VoiceResponse = require("twilio").twiml.VoiceResponse;
const querystring = require("querystring");
const accountSid = 'ACbe11bf5856751706836158a633466d34';
const authToken = 'a0ee05fa5617e158dd302945f36e811c';
const client = require("twilio")(accountSid, authToken);

const greetUser = (digit, res, db) => {
  const twiml = new VoiceResponse();
  var id = "";
  if (digit === 1) {
    twiml.say("You are an existing user"); //gather PID, if valid PID -> booking, listen pres
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

        var msg = `Registration successful, You're P I D is ${id}. To book an appointment press 1`;
        twiml.say(msg);
        twiml.hangup();

        //Initialize Auth credentials

        const accountSid = 'ACbe11bf5856751706836158a633466d34';
        const authToken = 'a0ee05fa5617e158dd302945f36e811c';
        const client = require("twilio")(accountSid, authToken);

        client.calls.list({limit: 1})
                    .then(calls => calls.forEach(c => {
                      console.log(`Time = ${c.dateUpdated}, From = ${c.from}`)

                      //Send SMS.
                      var SMSmsg = `Registration successful, You're P I D is ${id}.`
                      client.messages
                            .create({body: SMSmsg, from: c.to, to: c.from})
                            .then(message => console.log(message.sid));
                    }));

        res.send(twiml.toString());
      });

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

module.exports = {
  ivrMenu: ivrMenu,
  handleIVRRequest: handleIVRRequest,
};

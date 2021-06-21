const VoiceResponse = require("twilio").twiml.VoiceResponse;
const querystring = require("querystring");

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

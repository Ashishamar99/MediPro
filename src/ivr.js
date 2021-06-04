const VoiceResponse = require("twilio").twiml.VoiceResponse;
const querystring = require("querystring");

const greetUser = (digit, res) => {
  const twiml = new VoiceResponse();
  if (digit === 1) {
    twiml.say("You are an existing user");
  } else if (digit === 2) {
    twiml.say("You are a new user.");
  }
  twiml.hangup();
  res.send(twiml.toString());
};

const ivrMenu = (req, res, db) => {
  var body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", function () {
    let enteredDigit = parseInt(querystring.parse(body).Digits);
    greetUser(enteredDigit, res);
  });
  res.type("text/xml");
};

const handleIVRRequest = (req, res, db) => {
  const voiceResponse = new VoiceResponse();
  voiceResponse.say({ loop: 1 }, "Welcome to voice e-prescription");
  const gather = voiceResponse.gather({
    action: "/ivr/menu",
    numDigits: "1",
    // timeout: 5,
    method: "POST",
  });

  gather.say(
    "Please press 1 if you're an existing user" +
      "Press 2 if you're a new user",
    { loop: 2 }
  );
  res.type("text/xml");
  res.send(voiceResponse.toString());
};

module.exports = {
  ivrMenu: ivrMenu,
  handleIVRRequest: handleIVRRequest,
};

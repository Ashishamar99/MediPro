const sendSMS = require("../controllers/ivr").sendSMS;
const db = require("../database/knex");

const getConsultationList = (req, res) => {
  db.select("*")
    .from("consultations")
    .then((consultations) => {
      res.status(200).send(consultations);
    })
    .catch((err) => {
      res.send("Unable to get consultation details");
      console.error(err);
    });
};

const getConsultationWithID = (req, res) => {
  const cid = req.params.id;
  db.select("*")
    .from("consultations")
    .where("cid", "=", cid)
    .then((consultations) => {
      res.status(200).send(consultations);
    })
    .catch((err) => {
      res.send("Unable to get consultation details");
      console.error(err);
    });
};

const getPatientConsultation = (req, res) => {
  const pid = req.params.id;
  db.select("*")
    .from("consultations")
    .where("pid", "=", pid)
    .then((consultations) => {
      consultations.map((consultation) => {
        if (consultation && consultation.pdf) {
          consultation.pdf = consultation.pdf.toString();
        }
      });
      res.status(200).send(consultations);
    })
    .catch((err) => {
      res.send("Unable to get consultation details");
      console.error(err);
    });
};

const getDoctorConsultation = (req, res) => {
  const did = req.params.id;
  db.select("*")
    .from("consultations")
    .where("did", "=", did)
    .then((consultations) => {
      consultations.map((consultation) => {
        if (consultation && consultation.pdf) {
          consultation.pdf = consultation.pdf.toString();
        }
      });
      res.status(200).send(consultations);
    })
    .catch((err) => {
      res.send("Unable to get consultation details");
      console.error(err);
    });
};

const addConsultationInfo = (req, res) => {
  const speechData = req.body.audio;
  let formattedSpeechData = "";
  formattedSpeechData += `Diagnosing for, ${speechData.diagnosis}.`;
  let medicine = speechData.medicineData.join("\n");
  formattedSpeechData += ` Medicines prescribed, ${medicine}\n`;
  formattedSpeechData += speechData.advice.length
    ? `Advice, ${speechData.advice}`
    : "";
  req.body["audio"] = formattedSpeechData;
  db.transaction(function (trx) {
    const consultationInfo = req.body;
    return trx
      .insert(consultationInfo)
      .into("consultations")
      .then((id) => {
        trx.commit;
        // db.select("pphno")
        //   .from("patient")
        //   .where("pid", "=", consultationInfo.pid)
        //   .then((pphno) => {
        //     console.log(pphno[0].pphno, consultationInfo.pid);
        //     //SendSMS
        //     var patientPhoneNumber = String(pphno[0].pphno);

        //     //Removing +91 from phone number
        //     if (patientPhoneNumber.startsWith("+91")) {
        //       patientPhoneNumber = patientPhoneNumber.slice(3);
        //     }
        //     let SMSmessage = formattedSpeechData;
        //     console.log(SMSmessage.length);
        //     if (formattedSpeechData.length < 190) {
        //       sendSMS(SMSmessage, patientPhoneNumber);
        //     } else {
        //       SMSmessage = `Your audio prescription is generated for  ${speechData.diagnosis}, please call IVR service to listen to it`;
        //       sendSMS(SMSmessage, patientPhoneNumber);
        //     }
        //   })
        //   .catch((err) => {
        //     res.status(400).send("Unable to get user");
        //     console.error(err);
        //   });
        res.status(200).send(id);
        return;
      })
      .catch((err) => {
        trx.rollback;
        res.status(500).send("Couldn't complete consultation");
        console.error(err);
      });
  }).catch(function (err) {
    res.status(400).send("unable to complete consultation");
    console.error(err);
  });
};

module.exports = {
  getConsultationList: getConsultationList,
  getConsultationWithID: getConsultationWithID,
  getPatientConsultation: getPatientConsultation,
  getDoctorConsultation: getDoctorConsultation,
  addConsultationInfo: addConsultationInfo,
};

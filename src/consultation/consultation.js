const getConsultationList = (req, res, db) => {
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

const getConsultationWithID = (req, res, db) => {
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

const getPatientConsultation = (req, res, db) => {
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

const getDoctorConsultation = (req, res, db) => {
  const did = req.params.id;
  db.select("*")
    .from("consultations")
    .where("did", "=", did)
    .then((consultations) => {
      res.status(200).send(consultations);
    })
    .catch((err) => {
      res.send("Unable to get consultation details");
      console.error(err);
    });
};

const addConsultationInfo = (req, res, db) => {
  const speechData = req.body.audio;
  let formattedSpeechData = "";
  formattedSpeechData += `Diagnosing for, ${speechData.diagnosis}.`;
  let medicine = speechData.medicineData.join(".");
  formattedSpeechData += ` Medicines prescribed, ${medicine}.`;
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
        res.status(200).send(id);
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

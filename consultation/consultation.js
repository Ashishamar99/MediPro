const getConsultationList = (req, res, db) => {
  db.select("*")
    .from("consultation")
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
    .from("consultation")
    .where("cid", "=", cid)
    .then((consultations) => {
      res.status(200).send(consultations);
    })
    .catch((err) => {
      res.send("Unable to get consultation details");
      console.error(err);
    });
};
module.exports = {
  getConsultationList: getConsultationList,
  getConsultationWithID: getConsultationWithID,
};

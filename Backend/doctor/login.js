const handleDoctorLogin = (req, res, db) => {
  const { phno, password } = req.body;
  if (!phno || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("dphno", "dpasswd")
    .from("doctor")
    .where("dphno", "=", phno)
    .then((data) => {
      if (password.toString() === data[0].dpasswd) {
        return db
          .select("*")
          .from("doctor")
          .where("dphno", "=", phno)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json(err));
};

module.exports = {
  handleDoctorLogin: handleDoctorLogin,
};

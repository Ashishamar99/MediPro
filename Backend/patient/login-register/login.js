const handleLogin = (req, res, db) => {
  const { pphno, password } = req.body;

  if (!pphno || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("pphno", "ppasswd")
    .from("patient")
    .where("pphno", "=", pphno)
    .then((data) => {
      if (password.toString() === data[0].ppasswd) {
        return db
          .select("*")
          .from("patient")
          .where("pphno", "=", pphno)
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
  handleLogin: handleLogin,
};

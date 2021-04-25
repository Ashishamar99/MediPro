const DB = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "voice_based_eprescription",
  },
});
const HTTP = require('http')
const PORT = 3000;
const HOSTNAME = 'localhost';
const SERVER = HTTP.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

SERVER.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

module.exports = {
  DB: DB,
  SERVER: SERVER
}
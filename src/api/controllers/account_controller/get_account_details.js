const pool = require("../../utils/db/db_connection").pool;

function handleGetAccount(req, res) {
  const token = req.headers.authorization;
  const [, payload] = token.split(".");
  const decodedPayload = Buffer.from(payload, "base64").toString();
  const { username } = JSON.parse(decodedPayload);

  pool.query(
    "SELECT first_name, last_name FROM users WHERE username = $1",
    [username],
    (error, results) => {
      if (error) {
        console.error("Error retrieving account:", error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end("Internal Server Error");
      } else {
        console.log("Account details retrieved:", results.rows[0]);
        const accountDetails = results.rows[0];
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(JSON.stringify(accountDetails));
      }
    }
  );
}

module.exports = {
  handleGetAccount,
};

const pool = require("../../utils/db/db_connection").pool;

function handleUpdateAccount(req, res) {
  let body = [];
  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      const { firstName, lastName } = JSON.parse(body);

      const token = req.headers.authorization;
      const [, payload] = token.split(".");
      const decodedPayload = Buffer.from(payload, "base64").toString();
      const { username } = JSON.parse(decodedPayload);

      pool.query(
        "UPDATE users SET first_name = $1, last_name = $2 WHERE username = $3",
        [firstName, lastName, username],
        (error, results) => {
          if (error) {
            console.error("Error updating account:", error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "text/plain");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end("Internal Server Error");
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end("Account updated successfully");
          }
        }
      );
    });
}

module.exports = {
  handleUpdateAccount,
};

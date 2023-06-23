const crypto = require("crypto");
const { parse } = require("querystring");
const bcrypt = require("bcrypt");

const pool = require("../../utils/db/db_connection").pool;

async function handleResetPassword(req, res) {
  let body = [];
  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      body = Buffer.concat(body).toString();
      const { currentPassword, newPassword, confirmPassword } =
        JSON.parse(body);

      const token = req.headers.authorization;
      const [, payload] = token.split(".");
      const decodedPayload = Buffer.from(payload, "base64").toString();
      const { username } = JSON.parse(decodedPayload);

      pool.query(
        "SELECT password FROM users WHERE username = $1",
        [username],
        async (error, results) => {
          // Convert the callback to an async function
          if (error) {
            console.error("Error getting user:", error);
          } else {
            const user = results.rows[0];
            console.log(user);
            if (!verifyPassword(currentPassword, user.password)) {
              res.end("Current password is incorrect");
            } else if (newPassword !== confirmPassword) {
              res.end("New password and confirm password do not match");
            } else {
              try {
                const newPasswordHash = await bcrypt.hash(newPassword, 10);

                await new Promise((resolve, reject) => {
                  pool.query(
                    "UPDATE users SET password = $1 WHERE username = $2",
                    [newPasswordHash, username],
                    (error, results) => {
                      if (error) {
                        console.error("Error updating password:", error);
                        reject(error);
                      } else {
                        console.log(newPasswordHash);
                        resolve(results);
                      }
                    }
                  );
                });

                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end("Password updated successfully");
              } catch (error) {
                console.error("Error updating password:", error);
                res.statusCode = 500;
                res.setHeader("Content-Type", "text/plain");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end("Internal Server Error");
              }
            }
          }
        }
      );
    });
}

function verifyPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

module.exports = {
  handleResetPassword,
};

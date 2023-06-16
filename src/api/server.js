const http = require("http");
const url = require("url");
const { Pool } = require("pg");
const crypto = require("crypto");
const { parse } = require("querystring");
const bcrypt = require("bcrypt");

// Function to generate a random secret key
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const JWT_SECRET = generateSecretKey(); // Generating a secret key for JWT
console.log("JWT Secret Key:", JWT_SECRET);

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "unx",
  password: "b4",
  port: 5432,
}); // Creating a PostgreSQL database connection pool

const { handleLogin } = require("./controllers/login_controller");
const { handleRegistration } = require("./controllers/register_controller");
const { handleAddUser, handleGetAllUsers, handleDeleteUser, handleDeleteReview} = require("./controllers/admin_controller");


const server = http.createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Max-Age": "86400", // 24h
  };

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  const reqUrl = url.parse(req.url); // Parsing the request URL
  const reqPath = reqUrl.pathname;
  const reqMethod = req.method;
  let username = reqPath.split("/").pop();

  // preflight
  if (reqMethod === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else if (reqPath === "/register" && reqMethod === "POST") {
    handleRegistration(req, res);
  } else if (reqPath === "/login" && reqMethod === "POST") {
    handleLogin(req, res, JWT_SECRET);
  } else if (reqPath === "/updateAccount" && reqMethod === "POST") {
    handleUpdateAccount(req, res);
  } else if (reqPath === "/getAccountDetails" && reqMethod === "GET") {
    handleGetAccount(req, res);
  } else if (reqPath === "/resetPassword" && reqMethod === "PUT") {
    handleResetPassword(req, res);
  } else if (reqPath === "/admin/user/get-all" && reqMethod === "GET") {
    handleGetAllUsers(res);
  } else if (reqPath.startsWith('/admin/user/delete/') && reqMethod === "DELETE") {

    let username = reqPath.slice('/admin/user/delete/'.length);
    handleDeleteUser(username, res);
    
  } else if (reqPath === "/admin/user/add" && reqMethod === "POST") {
    handleAddUser(req, res);
  } else if (reqPath.startsWith('/admin/review/delete/') && reqMethod === "DELETE") {

    let reviewId = reqPath.slice('/admin/review/delete/'.length);
    handleDeleteReview(reviewId, res); // TODO: implement in admin_controller.js
    
  }
  else {
    res.statusCode = 404; // Handling unknown routes
    res.end("Not found");
  }
});

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
            // ...
          } else {
            const user = results.rows[0];
            console.log(user);
            if (!verifyPassword(currentPassword, user.password)) {
              // ...
            } else if (newPassword !== confirmPassword) {
              // ...
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

function handleGetAccount(req, res) {
  console.log("GET /getAccountDetails");
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

const port = 3000; // Port for the server to listen on
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

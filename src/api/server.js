const http = require("http");
const url = require("url");
const { Pool } = require("pg");
const crypto = require("crypto");
const { parse } = require("querystring");

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const JWT_SECRET = generateSecretKey();
console.log("JWT Secret Key:", JWT_SECRET);

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "unx",
  password: "postgres",
  port: 5432,
});

const { handleLogin } = require("./controllers/login_controller");
const { handleRegistration } = require("./controllers/register_controller");

const server = http.createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Max-Age": "86400", // 24h
  };

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  const reqUrl = url.parse(req.url);
  const reqPath = reqUrl.pathname;
  const reqMethod = req.method;

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
  } else {
    res.statusCode = 404;
    res.end("Not found");
  }
});

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

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

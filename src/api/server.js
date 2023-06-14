const http = require("http");
const url = require("url");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const JWT_SECRET = generateSecretKey();
console.log("JWT Secret Key:", JWT_SECRET);

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "unx",
  password: "admin",
  port: 5432,
});

const { handleLogin } = require("./controllers/login_controller");
const { handleRegistration } = require("./controllers/register_controller");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  const reqUrl = url.parse(req.url);
  const reqPath = reqUrl.pathname;
  const reqMethod = req.method;

  // pt CORS preflight
  if (reqMethod === "OPTIONS") {
    res.statusCode = 200;
    res.end();
  } else if (reqPath === "/register" && reqMethod === "POST") {
    handleRegistration(req, res);
  } else if (reqPath === "/login" && reqMethod === "POST") {
    handleLogin(req, res, JWT_SECRET);
  } else {
    res.statusCode = 404;
    res.end("Not found");
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

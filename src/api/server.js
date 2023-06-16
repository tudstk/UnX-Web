const http = require("http");
const url = require("url");
const { Pool } = require("pg");
const crypto = require("crypto");
const { parse } = require("querystring");
const bcrypt = require("bcrypt");

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const JWT_SECRET = generateSecretKey(); // Generating a secret key for JWT
console.log("JWT Secret Key:", JWT_SECRET);

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "unx",
  password: "postgres",
  port: 5432,
});

const { handleLogin } = require("./controllers/auth_controller/login");
const {
  handleRegistration,
} = require("./controllers/auth_controller/register");
const {
  handleResetPassword,
} = require("./controllers/account_controller/reset_password");
const {
  handleUpdateAccount,
} = require("./controllers/account_controller/update_account");
const {
  handleGetAccount,
} = require("./controllers/account_controller/get_account_details");
const {
  handleAddUser,
  handleGetAllUsers,
  handleDeleteUser,
  handleDeleteReview } = require("./controllers/admin_controller");


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

const port = 3000; // Port for the server to listen on
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

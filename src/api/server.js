const http = require("http");
const url = require("url");
const crypto = require("crypto");
const { parse } = require("querystring");
const bcrypt = require("bcrypt");

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const JWT_SECRET = generateSecretKey(); // Generating a secret key for JWT
console.log("JWT Secret Key:", JWT_SECRET);

const pool = require("./utils/db_connection").pool;

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
  handleDeleteReview,
} = require("./controllers/admin_controller");

const { handleGetData } = require("./controllers/data_controller");

const { insertDataFromCSVFiles } = require("./utils/import_data");

const server = http.createServer((req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Max-Age": "86400", // 24h
  };

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
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
  } else if (
    reqPath.startsWith("/admin/user/delete/") &&
    reqMethod === "DELETE"
  ) {
    let username = reqPath.slice("/admin/user/delete/".length);
    handleDeleteUser(username, res);
  } else if (reqPath === "/admin/user/add" && reqMethod === "POST") {
    handleAddUser(req, res);
  } else if (
    reqPath.startsWith("/admin/review/delete/") &&
    reqMethod === "DELETE"
  ) {
    let reviewId = reqPath.slice("/admin/review/delete/".length);
    handleDeleteReview(reviewId, res); // TODO: implement in admin_controller.js
  } else if(reqPath === "/visualizer/get-data" && reqMethod === "GET") {
    handleGetData(res, req);
  } else {
    res.statusCode = 404; // Handling unknown routes
    res.end("Not found");
  }
});

// const csvFiles = [
//   [
//     "educatie_1.csv",
//     "educatie_2.csv",
//     "educatie_3.csv",
//     "educatie_4.csv",
//     "educatie_5.csv",
//     "educatie_6.csv",
//     "educatie_7.csv",
//     "educatie_8.csv",
//     "educatie_9.csv",
//     "educatie_10.csv",
//     "educatie_11.csv",
//     "educatie_12.csv",
//   ],
//   [
//     "medii_1.csv",
//     "medii_2.csv",
//     "medii_3.csv",
//     "medii_4.csv",
//     "medii_5.csv",
//     "medii_6.csv",
//     "medii_7.csv",
//     "medii_8.csv",
//     "medii_9.csv",
//     "medii_10.csv",
//     "medii_11.csv",
//     "medii_12.csv",
//   ],
//   [
//     "rata_1.csv",
//     "rata_2.csv",
//     "rata_3.csv",
//     "rata_4.csv",
//     "rata_5.csv",
//     "rata_6.csv",
//     "rata_7.csv",
//     "rata_8.csv",
//     "rata_9.csv",
//     "rata_10.csv",
//     "rata_11.csv",
//     "rata_12.csv",
//   ],
//   [
//     "varste_1.csv",
//     "varste_2.csv",
//     "varste_3.csv",
//     "varste_4.csv",
//     "varste_5.csv",
//     "varste_6.csv",
//     "varste_7.csv",
//     "varste_8.csv",
//     "varste_9.csv",
//     "varste_10.csv",
//     "varste_11.csv",
//     "varste_12.csv",
//   ],
// ];

// const folderNames = [
//   "someri_educatie_judet",
//   "someri_mediu_judet",
//   "someri_tip_judete",
//   "someri_varsta_judet",
// ];

// insertDataFromCSVFiles(csvFiles, folderNames)
//   .then(() => {
//     console.log("CSV data imported successfully!");
//     pool.end();
//   })
//   .catch((error) => {
//     console.error("Error inserting data:", error);
//     pool.end();
//   });


const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${ port } `);
});

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

const pool = require("./utils/db/db_connection").pool;

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
  handleGetFeedbacks,
} = require("./controllers/feedback_controller/get_feedbacks");
const {
  handleSaveFeedback,
} = require("./controllers/feedback_controller/save_feedback");
const {
  handleGetData,
} = require("./controllers/filter_controller/data_controller");

const {
  handleAddUser,
  handleGetAllUsers,
  handleDeleteUser,
  handleDeleteReview,
} = require("./controllers/admin_controller/admin_controller");

const { importAllData } = require("./utils/csv_data/import_data");

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

  const reqUrl = url.parse(req.url);
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
  } else if (reqPath === "/user/account/details" && reqMethod === "PUT") {
    handleUpdateAccount(req, res);
  } else if (reqPath === "/visualizer/feedbacks" && reqMethod === "POST") {
    handleSaveFeedback(req, res);
  } else if (reqPath === "/user/account/details" && reqMethod === "GET") {
    handleGetAccount(req, res);
  } else if (reqPath === "/user/account/password" && reqMethod === "PUT") {
    handleResetPassword(req, res);
  } else if (reqPath === "/admin/users" && reqMethod === "GET") {
    handleGetAllUsers(res);
  } else if (reqPath === "/visualizer/feedbacks" && reqMethod === "GET") {
    handleGetFeedbacks(res);
  } else if (reqPath.startsWith("/admin/users/") && reqMethod === "DELETE") {
    let username = reqPath.slice("/admin/users/".length);
    handleDeleteUser(username, res);
  } else if (reqPath === "/admin/users" && reqMethod === "POST") {
    handleAddUser(req, res);
  } else if (
    reqPath.startsWith("/admin/feedbacks/") &&
    reqMethod === "DELETE"
  ) {
    let reviewId = reqPath.slice("/admin/feedbacks/".length);
    handleDeleteReview(reviewId, res);
  } else if (reqPath.startsWith("/visualizer/charts/data/") && reqMethod === "GET") {
    let filterString = reqPath.slice("/visualizer/charts/data/".length); // extracting filterString from url
    handleGetData(res, filterString);
  } else {
    res.statusCode = 404;
    res.end("Not found");
  }
});


const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port} `);
});

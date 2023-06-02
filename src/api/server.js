const http = require("http");
const url = require("url");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Setting CORS header to allow all origins
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Setting allowed HTTP methods
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  ); // Setting allowed request headers

  const reqUrl = url.parse(req.url); // Parsing the request URL
  const reqPath = reqUrl.pathname;
  const reqMethod = req.method;

  if (reqMethod === "OPTIONS") { // Handling CORS preflight request
    res.statusCode = 200;
    res.end();
  } else if (reqPath === "/register" && reqMethod === "POST") {
    handleRegistration(req, res);
  } else if (reqPath === "/login" && reqMethod === "POST") { 
    handleLogin(req, res);
  } else {
    res.statusCode = 404; // Handling unknown routes
    res.end("Not found");
  }
});

// Regular expression pattern for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*
Regular expression pattern for password validation
- The password must:
- contain at least one letter (uppercase or lowercase)
- contain at least one digit 
- be at least 6 characters long
*/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

const isValidEmail = (email) => {
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return passwordRegex.test(password);
};

async function handleRegistration(req, res) {
  try {
    let requestBody = "";

    req.on("data", (chunk) => {
      requestBody += chunk;
    });

    req.on("end", async () => {
      const { email, username, password } = JSON.parse(requestBody);

      // Validate email format
      if (!isValidEmail(email)) {
        console.log("INVALID EMAIL")
        res.statusCode = 400; // Bad Request status code
        res.setHeader("Content-Type", "application/json"); // Setting response content type
        res.end(JSON.stringify({ error: "Invalid email format" })); // Sending error response
        return;
      }

      // Validate password format
      if (!isValidPassword(password)) {
        res.statusCode = 400; // Bad Request status code
        res.setHeader("Content-Type", "application/json"); // Setting response content type
        res.end(JSON.stringify({ error: "Invalid password format" })); // Sending error response
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password

      const query =
        "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)"; // Query to insert user data
      await pool.query(query, [email, username, hashedPassword]);

      res.statusCode = 201; // Setting success status code
      res.setHeader("Content-Type", "application/json"); 
      res.end(JSON.stringify({ message: "User registered successfully!" })); 
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500; 
    res.setHeader("Content-Type", "application/json"); 
    res.end(
      JSON.stringify({ error: "An error occurred while registering the user." })
    ); // Sending error response
  }
}

async function handleLogin(req, res) {
  try {
    let requestBody = "";

    req.on("data", (chunk) => {
      requestBody += chunk;
    });

    req.on("end", async () => {
      const { email, password } = JSON.parse(requestBody);

      const query = "SELECT * FROM users WHERE email = $1"; // Query to retrieve user data
      const result = await pool.query(query, [email]); 

      if (result.rows.length === 0) { // Checking if user exists
        res.statusCode = 401; // unauthorized
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Invalid email or password." })); 
        return;
      }

      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password); // Validating the password

      if (!isPasswordValid) {
        res.statusCode = 401; // unauthorized
        res.setHeader("Content-Type", "application/json"); 
        res.end(JSON.stringify({ error: "Invalid email or password." })); 
        return;
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, username: user.username }, // Payload for JWT
        JWT_SECRET, 
        {
          expiresIn: "1h", // Expiration time for the JWT
        }
      );

      console.log("Login successful!");
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json"); 
      res.end(JSON.stringify({ token }));
    });
  } catch (error) { 
    console.error(error);
    res.statusCode = 500; 
    res.setHeader("Content-Type", "application/json"); 
    res.end(JSON.stringify({ error: "An error occurred while logging in." })); 
  }
}

const port = 3000; // Port for the server to listen on
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

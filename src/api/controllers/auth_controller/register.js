const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "unx",
  password: "postgres",
  port: 5432,
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
        console.log("INVALID EMAIL");
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

module.exports = {
  handleRegistration,
};

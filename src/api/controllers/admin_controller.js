const bcrypt = require("bcrypt");

const pool = require("../utils/db_connection").pool;

async function handleAddUser(req, res) {
  try {
    let requestBody = "";

    req.on("data", (chunk) => {
      requestBody += chunk;
    });

    req.on("end", async () => {
      const { email, username, password, isAdmin } = JSON.parse(requestBody);

      const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password

      const query =
        "INSERT INTO users (email, username, password, is_admin) VALUES ($1, $2, $3, $4)"; // Query to insert user data
      await pool.query(query, [email, username, hashedPassword, isAdmin]);

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

async function handleGetAllUsers(res) {
  try {
    const query = "SELECT * FROM users"; // Query to retrieve all users
    const result = await pool.query(query); // Execute the query

    const users = result.rows; // Extract the users from the query result

    res.statusCode = 200; // Setting success status code
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(users)); // Sending the users as a JSON response
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({ error: "An error occurred while fetching users." })
    ); // Sending error response
  }
}

async function handleDeleteUser(username, res) {
  try {
    const query = "DELETE FROM users WHERE username = $1"; // Query to delete the user by username
    await pool.query(query, [username]);

    res.statusCode = 200; // Setting success status code
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "User deleted successfully!" }));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({ error: "An error occurred while deleting the user." })
    );
  }
}

async function handleDeleteReview(reviewId, res) {
  console.log("I'm in handleDeleteReview()");
  // TODO: Implement this function
}

module.exports = {
  handleAddUser,
  handleGetAllUsers,
  handleDeleteUser,
  handleDeleteReview,
};

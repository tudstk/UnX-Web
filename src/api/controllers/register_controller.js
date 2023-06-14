const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "unx",
  password: "postgres",
  port: 5432,
});

async function handleRegistration(req, res) {
  try {
    let requestBody = "";

    req.on("data", (chunk) => {
      requestBody += chunk;
    });

    req.on("end", async () => {
      const { email, username, password } = JSON.parse(requestBody);
      const hashedPassword = await bcrypt.hash(password, 10);

      const query =
        "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)";
      await pool.query(query, [email, username, hashedPassword]);

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "User registered successfully!" }));
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({ error: "An error occurred while registering the user." })
    );
  }
}

module.exports = {
  handleRegistration,
};

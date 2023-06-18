const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../../utils/db_connection").pool;

async function handleLogin(req, res, JWT_SECRET) {
  try {
    let requestBody = "";

    req.on("data", (chunk) => {
      requestBody += chunk;
    });

    req.on("end", async () => {
      const { email, password } = JSON.parse(requestBody);

      const query = "SELECT * FROM users WHERE email = $1";
      const result = await pool.query(query, [email]);

      if (result.rows.length === 0) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Invalid email or password." }));
        return;
      }

      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Invalid email or password." }));
        return;
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          username: user.username,
          isAdmin: user.is_admin,
        },
        JWT_SECRET,
        {
          expiresIn: "1h",
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

module.exports = {
  handleLogin,
};

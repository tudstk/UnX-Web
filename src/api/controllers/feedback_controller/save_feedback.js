const pool = require("../../utils/db_connection").pool;

async function handleSaveFeedback(req, res) {
  try {
    let requestBody = "";

    req.on("data", (chunk) => {
      requestBody += chunk;
    });

    req.on("end", async () => {
      const { username, first_name, last_name, feedback, stars } =
        JSON.parse(requestBody);

      const query =
        "INSERT INTO feedback (username, first_name, last_name, feedback, stars) VALUES ($1, $2, $3, $4, $5)";
      await pool.query(query, [
        username,
        first_name,
        last_name,
        feedback,
        stars,
      ]);

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Feedback saved successfully!" }));
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({ error: "An error occurred while saving the feedback." })
    );
  }
}

module.exports = {
  handleSaveFeedback,
};

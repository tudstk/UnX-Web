const pool = require("../../utils/db_connection").pool;

async function getFeedbacks(req, res) {
  try {
    const query = "SELECT * FROM feedback";
    const result = await pool.query(query);
    const feedbacks = result.rows;

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(feedbacks));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "An error occurred while fetching the feedbacks." }));
  }
}

module.exports = {
  getFeedbacks,
};
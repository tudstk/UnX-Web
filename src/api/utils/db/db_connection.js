const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "unx",
  password: "b4",
  port: 5432,
  max: 50,
});

exports.pool = pool;

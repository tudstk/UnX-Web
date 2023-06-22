const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "unx",
  password: "admin",
  port: 5432,
  max: 50,
});

exports.pool = pool;

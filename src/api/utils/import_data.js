const fs = require("fs");
const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "unx",
  password: "postgres",
  port: 5432,
});

async function insertEducationData(filePath) {
  try {
    const fileData = await fs.promises.readFile(filePath, "utf-8");
    const rows = fileData.trim().split("\n").slice(1);

    const client = await pool.connect();
    await client.query("BEGIN");

    const insertQuery =
      "INSERT INTO educatie (JUDET, total, fara_studii, invatamant_primar, invatamant_gimnazial, invatamant_liceal, invatamant_posticeal, invatamant_profesional, invatamant_universitar, month) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
    const insertPromises = rows.map((row) => {
      const values = row.split(",");
      return client.query(insertQuery, [...values, null]);
    });

    await Promise.all(insertPromises);
    await client.query("COMMIT");

    console.log(`Data inserted from ${filePath}`);
  } catch (error) {
    console.error(`Error inserting data from ${filePath}:`, error);
  }
}

async function insertMediuData(filePath) {
  try {
    const fileData = await fs.promises.readFile(filePath, "utf-8");
    const rows = fileData.trim().split("\n").slice(1);

    const client = await pool.connect();
    await client.query("BEGIN");

    const insertQuery = `INSERT INTO mediu ("judet", "total", "total_femei", "total_barbati", "total_urban", "total_urban_femei", "total_urban_barbati", "total_rural", "total_rural_femei", "total_rural_barbati", "month")
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
    const insertPromises = rows.map((row) => {
      const values = row.split(",");
      return client.query(insertQuery, [...values, null]);
    });

    await Promise.all(insertPromises);
    await client.query("COMMIT");

    console.log(`Data inserted from ${filePath}`);
  } catch (error) {
    console.error(`Error inserting data from ${filePath}:`, error);
  }
}

async function insertDataFromCSVFiles(fileNames, path) {
  for (const fileName of fileNames) {
    const filePath = `../api/utils/${path}/${fileName}`;
    if (path === "someri_educatie_judet") {
      await insertEducationData(filePath);
    } else if (path === "someri_mediu_judet") {
      await insertMediuData(filePath);
    } else {
      console.log("Path not found");
    }
  }
}

module.exports = {
  insertDataFromCSVFiles,
};

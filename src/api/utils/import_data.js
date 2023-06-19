const fs = require("fs");
const { Pool } = require("pg");
const pool = require("./db_connection").pool;

async function insertEducationData(filePath, monthIndex) {
  try {
    const fileData = await fs.promises.readFile(filePath, "utf-8");
    const rows = fileData.trim().split("\n").slice(1);

    const client = await pool.connect();
    await client.query("BEGIN");

    const insertQuery =
      `INSERT INTO educatie (JUDET, total, fara_studii, invatamant_primar, invatamant_gimnazial, invatamant_liceal, invatamant_posticeal, invatamant_profesional, invatamant_universitar, month) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    const insertPromises = rows.map((row) => {
      const values = row.split(",");
      const insertValues = [...values, monthIndex];
      return client.query(insertQuery, insertValues);
    });


    await Promise.all(insertPromises);
    await client.query("COMMIT");

    console.log(`Data inserted from ${filePath}`);
  } catch (error) {
    console.error(`Error inserting data from ${filePath}:`, error);
  }
}

async function insertMediuData(filePath, monthIndex) {
  try {
    const fileData = await fs.promises.readFile(filePath, "utf-8");
    const rows = fileData.trim().split("\n").slice(1);

    const client = await pool.connect();
    await client.query("BEGIN");

    const insertQuery = `INSERT INTO mediu ("judet", "total", "total_femei", "total_barbati", "total_urban", "total_urban_femei", "total_urban_barbati", "total_rural", "total_rural_femei", "total_rural_barbati", "month")
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
    const insertPromises = rows.map((row) => {
      const values = row.split(",");
      const insertValues = [...values, monthIndex];
      return client.query(insertQuery, insertValues);
    });


    await Promise.all(insertPromises);
    await client.query("COMMIT");

    console.log(`Data inserted from ${filePath}`);
  } catch (error) {
    console.error(`Error inserting data from ${filePath}:`, error);
  }
}

async function insertRataData(filePath, monthIndex) {
  try {
    const fileData = await fs.promises.readFile(filePath, "utf-8");
    const rows = fileData.trim().split("\n").slice(1);

    const client = await pool.connect();
    await client.query("BEGIN");

    const insertQuery =
      "INSERT INTO rate (JUDET, total, total_femei, total_barbati, someri_indemnizati, someri_neindemnizati, rata_somajului, rata_somajului_feminina, rata_somajului_masculina, month) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
    const insertPromises = rows.map((row) => {
      const values = row.split(",");
      const insertValues = [...values, monthIndex];
      return client.query(insertQuery, insertValues);
    });


    await Promise.all(insertPromises);
    await client.query("COMMIT");

    console.log(`Data inserted from ${filePath}`);
  } catch (error) {
    console.error(`Error inserting data from ${filePath}:`, error);
  }
}

async function insertVarstaData(filePath, monthIndex) {
  try {
    const fileData = await fs.promises.readFile(filePath, "utf-8");
    const rows = fileData.trim().split("\n").slice(1);

    const client = await pool.connect();
    await client.query("BEGIN");

    const insertQuery =
      "INSERT INTO varste (JUDET, total, sub_25, age_25_29, age_30_39, age_40_49, age_50_55, age_over_55, month) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
    const insertPromises = rows.map((row) => {
      const values = row.split(",");
      const insertValues = [...values, monthIndex];
      return client.query(insertQuery, insertValues);
    });


    await Promise.all(insertPromises);
    await client.query("COMMIT");

    console.log(`Data inserted from ${filePath}`);
  } catch (error) {
    console.error(`Error inserting data from ${filePath}:`, error);
  }
}


async function insertDataFromCSVFiles(fileNamesArray, pathArray) {
  for (let i = 0; i < 4; i++) {
    const fileNames = fileNamesArray[i];
    const path = pathArray[i];
    let monthIndex = 1;
    for (const fileName of fileNames) {
      const filePath = `src/api/utils/${path}/${fileName}`;
      if (path === "someri_educatie_judet") {
        await insertEducationData(filePath, monthIndex);
      } else if (path === "someri_mediu_judet") {
        await insertMediuData(filePath, monthIndex);
      } else if (path === "someri_tip_judete") {
        await insertRataData(filePath, monthIndex);
      } else if (path === "someri_varsta_judet") {
        await insertVarstaData(filePath, monthIndex);
      } else {
        console.log("Path not found");
      }

      monthIndex++;
    }
  }
}

module.exports = {
  insertDataFromCSVFiles,
};

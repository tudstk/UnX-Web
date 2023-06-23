const fs = require("fs");
const { Pool } = require("pg");
const pool = require("../db/db_connection").pool;

async function insertEducationData(filePath, monthIndex) {
  try {
    const fileData = await fs.promises.readFile(filePath, "utf-8");
    const rows = fileData.trim().split("\n").slice(1);

    const client = await pool.connect();
    await client.query("BEGIN");

    const insertQuery = `INSERT INTO educatie (JUDET, total, fara_studii, invatamant_primar, invatamant_gimnazial, invatamant_liceal, invatamant_posticeal, invatamant_profesional, invatamant_universitar, month) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
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
  } catch (error) {
    console.error(`Error inserting data from ${filePath}:`, error);
  }
}

async function insertDataFromCSVFiles(fileNamesArray, pathArray) {
  const months = [
    null, // placeholder pt 0
    "Ianuarie",
    "Februarie",
    "Martie",
    "Aprilie  ",
    "Mai",
    "Iunie",
    "Iulie",
    "August",
    "Septembrie",
    "Octombrie",
    "Noiembrie",
    "Decembrie",
  ];

  for (let i = 0; i < 4; i++) {
    const fileNames = fileNamesArray[i];
    const path = pathArray[i];
    for (let j = 0; j < fileNames.length; j++) {
      const fileName = fileNames[j];
      const filePath = `../api/utils/csv_data/${path}/${fileName}`;

      const monthIndex = parseInt(fileName.match(/(\d+)\.csv$/)[1]);

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

      console.log(`Data inserted from ${filePath} for ${months[monthIndex]}`);
    }
  }
}

function importAllData() {
  const csvFiles = [
    [
      "educatie_1.csv",
      "educatie_2.csv",
      "educatie_3.csv",
      "educatie_4.csv",
      "educatie_5.csv",
      "educatie_6.csv",
      "educatie_7.csv",
      "educatie_8.csv",
      "educatie_9.csv",
      "educatie_10.csv",
      "educatie_11.csv",
      "educatie_12.csv",
    ],
    [
      "medii_1.csv",
      "medii_2.csv",
      "medii_3.csv",
      "medii_4.csv",
      "medii_5.csv",
      "medii_6.csv",
      "medii_7.csv",
      "medii_8.csv",
      "medii_9.csv",
      "medii_10.csv",
      "medii_11.csv",
      "medii_12.csv",
    ],
    [
      "rata_1.csv",
      "rata_2.csv",
      "rata_3.csv",
      "rata_4.csv",
      "rata_5.csv",
      "rata_6.csv",
      "rata_7.csv",
      "rata_8.csv",
      "rata_9.csv",
      "rata_10.csv",
      "rata_11.csv",
      "rata_12.csv",
    ],
    [
      "varste_1.csv",
      "varste_2.csv",
      "varste_3.csv",
      "varste_4.csv",
      "varste_5.csv",
      "varste_6.csv",
      "varste_7.csv",
      "varste_8.csv",
      "varste_9.csv",
      "varste_10.csv",
      "varste_11.csv",
      "varste_12.csv",
    ],
  ];

  const folderNames = [
    "someri_educatie_judet",
    "someri_mediu_judet",
    "someri_tip_judete",
    "someri_varsta_judet",
  ];

  insertDataFromCSVFiles(csvFiles, folderNames)
    .then(() => {
      console.log("CSV data imported successfully!");
      pool.end();
    })
    .catch((error) => {
      console.error("Error inserting data:", error);
      pool.end();
    });
}

module.exports = {
  importAllData,
};

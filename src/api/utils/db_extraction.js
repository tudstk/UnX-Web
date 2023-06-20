const pool = require("./db_connection").pool;

/**
 * @param {string} table: numele tabelului din care se extrage data
 * @param {array} judete: array cu judetele selectate
 * @param {string} monthStatement: perioada pentru care se extrage data
 * @returns {string} query: query-ul generat
 */
function generateQuery(table, judete, monthStatement) {
  let query = `SELECT * FROM ${table} WHERE judet `;

  if (judete.length === 1) {
    query += ` = '${judete[0]}'`;
  } else {
    query += ` IN ('${judete.join("', '")}')`;
  }

  switch (monthStatement) {
    case "ultima_luna":
      query += ` AND month = 12`;
      break;
    case "ultimele_3_luni":
      query += ` AND month BETWEEN 10 AND 12`;
      break;
    case "ultimele_6_luni":
      query += ` AND month BETWEEN 7 AND 12`;
      break;
    case "ultimele_12_luni":
      query += ``; // nu se adauga nimic
      break;
    default:
      break;
  }
  return query;
}

async function extractDataArray(table, judete, monthStatement) {
  let responseArray;
  try {
    const client = await pool.connect();

    //const query = `SELECT * FROM educatie WHERE judet = 'TOTAL' AND month = '1'`;
    const query = generateQuery(table, judete, monthStatement);

    const result = await client.query(query);

    const data = result.rows.map((row) => {
      const attributes = Object.keys(row).filter((key) => key !== "judet");
      const values = attributes.map((attr) => row[attr]);
      return [attributes, values];
    });

    const transformedArray = [];

    for (let i = 0; i < data.length; i++) {
      const subArray = data[i][1]; // Access the nested array

      // Iterate over the elements in the sub-array
      for (let j = 0; j < subArray.length - 1; j++) {
        // -1 because we don't want to include the month
        const currentElement = subArray[j];

        // Check if the transformedArray already contains an entry for the current element
        const index = transformedArray.findIndex(
          (entry) => entry[0] === data[i][0][j]
        );

        if (index !== -1) {
          // If the entry exists, add the current element's value to the existing entry
          transformedArray[index][1] += currentElement;
        } else {
          // If the entry doesn't exist, create a new entry in the transformedArray
          transformedArray.push([data[i][0][j], currentElement]);
        }
      }
    }

    //console.log(transformedArray);
    responseArray = transformedArray;
  } catch (error) {
    console.error("Error extracting age groups data:", error);
  }

  return responseArray;
}

module.exports = {
  extractDataArray,
};

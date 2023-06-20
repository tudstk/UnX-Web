const pool = require("./db_connection").pool;

function medianPercentageArray(transformedArray, numberOfCounties, numberOfMonths) { // in case of rate
  medianArray = transformedArray;

  for (let i = 5; i < medianArray.length; i++) { // floating fields in array
    medianArray[i][1] = medianArray[i][1] / (numberOfMonths * numberOfCounties);
    medianArray[i][1] = parseFloat(medianArray[i][1].toFixed(2)); // rounding to 2 decimals
  }

  return medianArray;
}
function getNumberOfMonths(monthStatement) {
  switch (monthStatement) {
    case "ultima_luna":
      return 1;
    case "ultimele_3_luni":
      return 3;
    case "ultimele_6_luni":
      return 6;
    case "ultimele_12_luni":
      return 12;
    default:
      return -1;
  }
}

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

    const query = generateQuery(table, judete, monthStatement);

    const result = await client.query(query);

    const data = result.rows.map((row) => {
      const attributes = Object.keys(row).filter((key) => key !== "judet");
      const values = attributes.map((attr) => row[attr]);
      return [attributes, values];
    });

    let transformedArray = [];

    for (let i = 0; i < data.length; i++) {
      const subArray = data[i][1]; // Access the nested array

      // Iterate over the elements in the sub-array
      for (let j = 0; j < subArray.length - 1; j++) {
        // -1 because we don't want to include the month
        let currentElement = subArray[j];

        if (typeof currentElement === 'string' || currentElement instanceof String) {// percentages are extracted as strings from the database
          
          currentElement = parseFloat(currentElement);
        }

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

    if (table === 'rate') {
      let numberOfCounties = judete.length;

      if (judete[0] === 'TOTAL') {
        numberOfCounties = 42;
      }

      transformedArray = medianPercentageArray(transformedArray, numberOfCounties, getNumberOfMonths(monthStatement));
    }
    responseArray = transformedArray;
  } catch (error) {
    console.error("Error extracting age groups data:", error);
  }

  return responseArray;
}

module.exports = {
  extractDataArray,
};

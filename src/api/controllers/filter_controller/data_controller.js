const pool = require("../../utils/db/db_connection").pool;
const { extractDataArray } = require("../../utils/db/db_extraction");

async function filterStringToObject(filterString) {
  // Create a new instance of URLSearchParams and pass the query string
  const params = new URLSearchParams(filterString);

  // Create an empty object to store the extracted values
  let extractedObject = {};
  // Iterate over the URLSearchParams entries and populate the object
  for (const [key, value] of params.entries()) {
    // If the key already exists in the object, convert the value to an array and push the new value
    if (extractedObject.hasOwnProperty(key)) {
      if (!Array.isArray(extractedObject[key])) {
        extractedObject[key] = [extractedObject[key]];
      }
      extractedObject[key].push(value);
    } else {
      // Otherwise, set the value as a single key-value pair
      extractedObject[key] = value;
    }
  }
  return extractedObject;
}

async function handleGetData(res, filterString) {
  //console.log("Filter string:", filterString);
  try {
    const filterObject = await filterStringToObject(filterString);

    if (!Array.isArray(filterObject.judete)){
      filterObject.judete = [filterObject.judete];
    }

    let responseArray = await extractDataArray(filterObject.categorie, filterObject.judete, filterObject.perioada);

    res.statusCode = 200; // Setting success status code
    res.setHeader("Content-Type", "application/json");
    await res.end(JSON.stringify(responseArray));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "An error occurred while getting data." })); // Sending error response
  }
}

module.exports = {
  handleGetData,
};

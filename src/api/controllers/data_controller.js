const pool = require("../utils/db_connection").pool;
const { extractDataArray } = require("../utils/db_extraction");


async function handleGetData(res, req) {
    try {
      let requestBody = "";
  
      req.on("data", (chunk) => {
        requestBody += chunk;
      });
  
      req.on("end", async () => {
        const { criteriu, judete, perioada } = JSON.parse(requestBody);
  
        let responseArray = await extractDataArray(criteriu, judete, perioada);
        console.log(responseArray);
        res.statusCode = 200; // Setting success status code
        res.setHeader("Content-Type", "application/json");
        await res.end(JSON.stringify(responseArray));
      });
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({ error: "An error occurred while getting data." })
      ); // Sending error response
    }
  }
  
  module.exports = {
    handleGetData,
  };
  
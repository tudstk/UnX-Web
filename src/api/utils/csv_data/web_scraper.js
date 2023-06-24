const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

function extractCsvUrlsFromHtml(html) {
  const $ = cheerio.load(html);
  const csvUrls = [];

  $("a.resource-url-analytics").each((index, element) => {
    const csvUrl = $(element).attr("href");
    csvUrls.push(csvUrl);
  });

  return csvUrls;
}

function extractFileNameFromUrl(url) {
  const parts = url.split("/");
  return parts[parts.length - 1];
}
const links = [
  "https://data.gov.ro/dataset/somajul-inregistrat-martie-2023",
  "https://data.gov.ro/dataset/somajul-inregistrat-februarie-2023",
  "https://data.gov.ro/dataset/somajul-inregistrat-ianuarie-2023",
  "https://data.gov.ro/dataset/somajul-inregistrat-decembrie-2022",
  "https://data.gov.ro/dataset/somajul-inregistrat-noiembrie-2022",
  "https://data.gov.ro/dataset/somajul-inregistrat-octombrie-2022",
  "https://data.gov.ro/dataset/somajul-inregistrat-septembrie-2022",
  "https://data.gov.ro/dataset/somajul-inregistrat-august-2022",
  "https://data.gov.ro/dataset/somajul-inregistrat-iulie-2022",
  "https://data.gov.ro/dataset/somajul-inregistrat-iunie-2022",
  "https://data.gov.ro/dataset/somajul-inregistrat-mai-2022",
  "https://data.gov.ro/dataset/somajul-inregistrat-aprilie-2022",
];

function webScraper(downloadFolder) {
  const downloadPromises = links.map((link) => {
    return axios.get(link).then((response) => {
      const csvUrls = extractCsvUrlsFromHtml(response.data);
      const csvDownloadPromises = csvUrls.map((csvUrl) => {
        return axios
          .get(csvUrl, { responseType: "stream" })
          .then((csvResponse) => {
            const fileName = extractFileNameFromUrl(csvUrl);
            const filePath = path.join(downloadFolder, fileName);
            const fileStream = fs.createWriteStream(filePath);
            csvResponse.data.pipe(fileStream);
          });
      });
      return Promise.all(csvDownloadPromises);
    });
  });

  Promise.all(downloadPromises)
    .then(() => {
      console.log("CSV files downloaded successfully!");
    })
    .catch((error) => {
      console.log("Failed to download CSV files.");
    });
}

module.exports = { webScraper };

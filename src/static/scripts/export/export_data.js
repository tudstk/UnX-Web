function arrayToCsv(data) {
  return data
    .map((row) =>
      row
        .map(String)
        .map((v) => v.replaceAll('"', '""'))
        .map((v) => `"${v}"`)
        .join(",")
    )
    .join("\r\n");
}

function downloadBlob(content, filename, contentType) {
  var blob = new Blob([content], { type: contentType });
  var url = URL.createObjectURL(blob);

  var pom = document.createElement("a");
  pom.href = url;
  pom.setAttribute("download", filename);
  pom.click();
}

function exportData() {
  const selectedFormat = document.getElementById("export-format").value;

  if (selectedFormat === "CSV") {
    const csv = arrayToCsv(filteredData);

    const selectedOptionsRow = ["Selected Options"].concat(selectedOptions);
    const updatedCsv = csv + "\r\n" + selectedOptionsRow.join(",");

    downloadBlob(updatedCsv, "export.csv", "text/csv;charset=utf-8;");
  } else if (selectedFormat === "SVG") {
    const svgElement = document.querySelector(".chart-wrapper svg");
    const svgContent = svgElement.outerHTML;
    downloadBlob(svgContent, "export.svg", "image/svg+xml");
  } else if (selectedFormat === "PDF") {
    //leustean
  }
}

document.getElementById("export-button").addEventListener("click", exportData);

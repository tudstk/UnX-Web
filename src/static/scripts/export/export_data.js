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

function exportChartsAsPDF() {
  var doc = new jsPDF();
  var chartWidth = 120; // Adjust the width of the charts
  var chartHeight = 75; // Adjust the height of the charts
  var spaceBetweenCharts = 10; // Adjust the space between charts

  // Calculate the center position of the page
  var pageCenterX = doc.internal.pageSize.getWidth() / 2;
  var marginTop = 20; // Adjust the top margin

  // Add the first chart centered on the page horizontally
  var chart1X = pageCenterX - chartWidth / 2;
  var chart1Y = marginTop;
  doc.addImage(pieChart.chart.getImageURI(), chart1X, chart1Y, chartWidth, chartHeight);

  // Add the second chart below the first chart
  var chart2X = pageCenterX - chartWidth / 2;
  var chart2Y = chart1Y + chartHeight + spaceBetweenCharts;
  doc.addImage(barChart.chart.getImageURI(), chart2X, chart2Y, chartWidth, chartHeight);

  // Add the third chart below the second chart
  var chart3X = pageCenterX - chartWidth / 2;
  var chart3Y = chart2Y + chartHeight + spaceBetweenCharts;
  doc.addImage(lineChart.chart.getImageURI(), chart3X, chart3Y, chartWidth, chartHeight);

  doc.save('chart.pdf');
}

function exportChartsAsSVG() {
  let pieChartSvg = document.getElementById("pie-chart").getElementsByTagName('svg')[0].outerHTML;
  let barChartSvg = document.getElementById("bar-chart").getElementsByTagName('svg')[0].outerHTML;
  let lineChartSvg = document.getElementById("line-chart").getElementsByTagName('svg')[0].outerHTML;

  downloadBlob(pieChartSvg, "pie-chart.svg", "image/svg+xml");
  downloadBlob(barChartSvg, "bar-chart.svg", "image/svg+xml");
  downloadBlob(lineChartSvg, "line-chart.svg", "image/svg+xml");
}

function exportData() {

  let dropdown = document.getElementById("export-format");
  let selectedFormat = dropdown.options[dropdown.selectedIndex].value;


  switch (selectedFormat) {
    case "CSV":
      const csv = arrayToCsv(filteredData);
      
      // Add selectedOptions as a new row in the CSV
      const selectedOptionsRow = ["Selected Options"].concat(selectedOptions);
      const updatedCsv = csv + "\r\n" + selectedOptionsRow.join(",");
      downloadBlob(updatedCsv, "export.csv", "text/csv;charset=utf-8;");
      break;

    case "PDF":
      exportChartsAsPDF();
      break;

    case "SVG":
      exportChartsAsSVG();
      break;

    default:
      break;

  }

}
document.getElementById("export-button").addEventListener("click", exportData);

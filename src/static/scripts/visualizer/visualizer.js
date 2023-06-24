const pieChart = {
  chart: null,
  data: [
    ["Judet", "Numar someri"],
    ["No Data", 1],
  ],
  element: "#pie-chart",
  options: {
    title: "Choose data from filters",
    is3D: true,
    width: 660,
    height: 370,
  },
};

const barChart = {
  chart: null,
  data: [
    ["Judet", "Numar someri"],
    ["No Data", 0],
  ],
  element: "#bar-chart",
  options: {
    title: "Choose data from filters",
    width: 660,
    height: 370,
  },
};

const lineChart = {
  chart: null,
  data: [
    ["Year", "Procent"],
    ["No Data", 0],
  ],
  element: "#line-chart",
  options: {
    title: "Choose data from filters",
    width: 660,
    height: 370,
  },
};

// https://developers.google.com/chart/interactive/docs/gallery/piechart
// https://developers.google.com/chart/interactive/docs/gallery/barchart
// https://developers.google.com/chart/interactive/docs/gallery/linechart
// https://developers.google.com/chart/interactive/docs/reference#draw
// https://developers.google.com/chart/interactive/docs/reference#arraytodatatable
const init = () => {
  pieChart.chart = new google.visualization.PieChart(
    document.querySelector(pieChart.element)
  );
  pieChart.chart.draw(
    google.visualization.arrayToDataTable(pieChart.data),
    pieChart.options
  );

  barChart.chart = new google.visualization.BarChart(
    document.querySelector(barChart.element)
  );
  barChart.chart.draw(
    google.visualization.arrayToDataTable(barChart.data),
    barChart.options
  );

  lineChart.chart = new google.visualization.LineChart(
    document.querySelector(lineChart.element)
  );
  lineChart.chart.draw(
    google.visualization.arrayToDataTable(lineChart.data),
    lineChart.options
  );
};

// https://developers.google.com/chart/interactive/docs/quick_start
google.charts.load("current", {
  packages: ["corechart"],
  callback: init,
});

function showDiv(id) {
  var charts = document.getElementsByClassName("chart");
  for (var i = 0; i < charts.length; i++) {
    if (charts[i].id == id) {
      charts[i].style.display = "block";
    } else {
      charts[i].style.display = "none";
    }
  }
}

const showFiltersBtn = document.querySelector(".show-filters-btn");
showFiltersBtn.addEventListener("click", showFilters);

function showFilters() {
  const filters = document.querySelector(".filters");
  if (filters.style.display === "block") {
    filters.style.display = "none";
    showFiltersBtn.textContent = "Show filters";
  } else {
    filters.style.display = "block";
    showFiltersBtn.textContent = "Hide filters";
  }
}

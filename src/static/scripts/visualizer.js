const pieChart = {
  chart: null,
  data: [
    ["Judet", "Numar someri"],
    ["Bucuresti", 100000],
    ["Iasi", 25000],
    ["Cluj", 30000],
    ["Constanta", 17000],
    ["Restul judetelor", 125000],
  ],
  element: "#pie-chart",
  options: {
    title: "Someri pe judete",
    width: 500,
    height: 300,
  },
};

const barChart = {
  chart: null,
  data: [
    ["Judet", "Numar someri"],
    ["Bucuresti", 100000],
    ["Iasi", 25000],
    ["Cluj", 30000],
    ["Constanta", 17000],
    ["Restul judetelor", 125000],
  ],
  element: "#bar-chart",
  options: {
    title: "Someri pe judete",
    width: 500,
    height: 300,
  },
};

const lineChart = {
  chart: null,
  data: [
    ["Year", "Procent"],
    ["2015", 4],
    ["2016", 4.5],
    ["2017", 4],
    ["2018", 4.9],
    ["2019", 5.5],
  ],
  element: "#line-chart",
  options: {
    title: "Numarul total de someri din judetele selectate in lunile selectate",
    width: 500,
    height: 300,
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

/*
// https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
document.querySelector('#update-pie-chart').addEventListener('click', () => {
  pieChart.data = [
    ['Product', 'Sales'],
    ['Laptops', 1508],
    ['Desktops', 1497],
    ['Cameras', 360],
    ['Phones', 1790],
    ['Accessories', 518]
  ];
  pieChart.chart.draw(
    google.visualization.arrayToDataTable(pieChart.data),
    pieChart.options
  );
});
*/

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


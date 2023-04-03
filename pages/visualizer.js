const listaJudete = ["Alba", "Arad", "Arges", "Bacau", "Bistrita-Nasaud", "Botosani", "Braila", "Brasov", "Bucuresti", "Buzau", "Calarasi", "Caras-Severin", "Cluj", "Constanta", "Covasna", "Dambovita", "Dolj", "Galati", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomita", "Iasi", "Ilfov", "Maramures", "Mehedinti", "Mures", "Neamt", "Olt", "Prahova", "Salaj", "Satu Mare", "Sibiu", "Suceava", "Teleorman", "Timis", "Tulcea", "Vaslui", "Valcea", "Vrancea"];

listaJudete.forEach(createDivs);

function createDivs(value, index, array) {
  const newInput = document.createElement('input');
  const newLabel = document.createElement('label');
  const lineBreak = document.createElement('br');

  newInput.setAttribute('type', 'checkbox');
  newInput.setAttribute('id', value);
  newInput.setAttribute('name', value);
  newInput.setAttribute('value', value);
  newLabel.setAttribute('for', value);
  newLabel.textContent = value;

  const formJudete = document.getElementById('judete');

  formJudete.appendChild(newInput);
  formJudete.appendChild(newLabel);
  formJudete.appendChild(lineBreak);
}


const pieChart = {
  chart: null,
  data: [
    ['Judet', 'Numar someri'],
    ['Bucuresti', 100000],
    ['Iasi', 25000],
    ['Cluj', 30000],
    ['Constanta', 17000],
    ['Restul judetelor', 125000]
  ],
  element: '#pie-chart',
  options: {
    title: 'Someri pe judete',
    width: 500,
    height: 300
  }
};

const barChart = {
  chart: null,
  data: [
    ['Judet', 'Numar someri'],
    ['Bucuresti', 100000],
    ['Iasi', 25000],
    ['Cluj', 30000],
    ['Constanta', 17000],
    ['Restul judetelor', 125000]
  ],
  element: '#bar-chart',
  options: {
    title: 'Someri pe judete',
    width: 500,
    height: 300
  }
};

const lineChart = {
  chart: null,
  data: [
    ['Year', 'Procent'],
    ['2015', 4],
    ['2016', 4.5],
    ['2017', 4],
    ['2018', 4.9],
    ['2019', 5.5]
  ],
  element: '#line-chart',
  options: {
    title: 'Procentul somerilor raportat la totalul populatiei pe ani',
    width: 600,
    height: 300
  }
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
google.charts.load('current', {
  packages: ['corechart'],
  callback: init
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

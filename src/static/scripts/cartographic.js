const data = [
    ["Alba", 20000],
    ["Arad", 21000],
    ["Arges", 22000],
    ["Bacau", 23000],
    ["Bistrita-Nasaud", 24000],
    ["Botosani", 25000],
    ["Braila", 26000],
    ["Brasov", 27000],
    ["Bucuresti", 27500],
    ["Buzau", 28000],
    ["Calarasi", 29000],
    ["Caras-Severin", 30000],
    ["Cluj", 31000],
    ["Constanta", 32000],
    ["Covasna", 33000],
    ["Dambovita", 34000],
    ["Dolj", 35000],
    ["Galati", 36000],
    ["Giurgiu", 37000],
    ["Gorj", 38000],
    ["Harghita", 39000],
    ["Hunedoara", 40000],
    ["Ialomita", 41000],
    ["Iasi", 42000],
    ["Ilfov", 43000],
    ["Maramures", 44000],
    ["Mehedinti", 45000],
    ["Mures", 46000],
    ["Neamt", 47000],
    ["Olt", 48000],
    ["Prahova", 49000],
    ["Salaj", 50000],
    ["Satu Mare", 51000],
    ["Sibiu", 52000],
    ["Suceava", 53000],
    ["Teleorman", 54000],
    ["Timis", 55000],
    ["Tulcea", 56000],
    ["Vaslui", 57000],
    ["Valcea", 57500],
    ["Vrancea", 58000]
];

var width = 900,
    height = 450;

var svg = d3
  .select("#map_container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var projection = d3.geo.albers()
    .center([0, 0])
    .rotate([-17, 0])
    .scale(5300)
    .translate([-width / 5 + 100, 4350]);

var geoPath = d3.geo.path().projection(projection);

queue().defer(d3.json, "../static/topojson/romania-counties.json").await(ready);

function ready(error, counties) {
  var romania = topojson.feature(counties, counties.objects.ROU_adm1).features;
  console.log(romania);

  svg
    .append("g")
    .selectAll("path")
    .data(romania)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .attr("class", "county");

    var id = 0;
    d3.selectAll("path")
        .attr('id', function () {
            return id++;
        })
        .on("click", function (obj) {

            console.log(obj.properties.ID_1);
            console.log(obj.properties.NAME_1);

            var paragraph = d3.select("#county_info");
            paragraph.text("Judetul " + obj.properties.NAME_1 + ": " +
             data[obj.properties.ID_1-1][1] + " someri");
        });

    //console.log(romania[8].properties.NAME_1);
}

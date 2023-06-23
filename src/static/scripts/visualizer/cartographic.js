const judete = [
  "ALBA",
  "ARAD",
  "ARGES",
  "BACAU",
  "BIHOR",
  "BISTRITA NASAUD",
  "BOTOSANI",
  "BRAILA",
  "BRASOV",
  "BUZAU",
  "CALARASI",
  "CARAS-SEVERIN",
  "CLUJ",
  "CONSTANTA",
  "COVASNA",
  "DAMBOVITA",
  "DOLJ",
  "GALATI",
  "GIURGIU",
  "GORJ",
  "HARGHITA",
  "HUNEDOARA",
  "IALOMITA",
  "IASI",
  "ILFOV",
  "MARAMURES",
  "MEHEDINTI",
  "BUCURESTI",
  "MURES",
  "NEAMT",
  "OLT",
  "PRAHOVA",
  "SALAJ",
  "SATU MARE",
  "SIBIU",
  "SUCEAVA",
  "TELEORMAN",
  "TIMIS",
  "TULCEA",
  "VALCEA",
  "VASLUI",
  "VRANCEA",
];

var width = 900,
  height = 450;

var svg = d3
  .select("#map_container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var projection = d3.geo
  .albers()
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
    .attr("id", function () {
      return id++;
    })
    .on("click", function (obj) {
      let filterObject = {
        categorie: "rate",
        judete: [judete[obj.properties.ID_1 - 1]],
        perioada: "ultimele_12_luni",
      };

      let filterString = filterObjectToString(filterObject);
      console.log("Filter string:", filterString);
      let url = `http://localhost:3000/visualizer/charts/data/${filterString}`;
  
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data[0]);
          data = data[0];
          var divParagraph = document.getElementById("county_info");
          divParagraph.innerHTML = "";

          var countyName = document.createElement("h3");
          let nameString = obj.properties.NAME_1;
          nameString =
            "Judetul " +
            nameString.charAt(0).toUpperCase() +
            nameString.slice(1);
          countyName.textContent = nameString;

          var totalSomeri = document.createElement("h4");
          totalSomeri.textContent =
            "Totalul somerilor din ultimul an " + data[0][1];

          var rataSomeri = document.createElement("h4");
          rataSomeri.textContent =
            "Rata somajului din ultimul an " + data[5][1] + "%";

          divParagraph.appendChild(countyName);
          divParagraph.appendChild(totalSomeri);
          divParagraph.appendChild(rataSomeri);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}

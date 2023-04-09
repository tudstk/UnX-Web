var width = 900,
  height = 600;

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
  .translate([-width / 5, 4500]);

var geoPath = d3.geo.path().projection(projection);

<<<<<<< HEAD
     svg.append("g")
        .selectAll("path")
        .data(romania)
        .enter()
        .append("path")
        .attr( "d", geoPath )
        .attr("class","county");
    
    var id = 0;
    d3.selectAll("path")
    .attr('id', function() {
        return id++;
    })

    //console.log(romania[8].properties.NAME_1);
=======
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

  console.log(romania[8].properties.NAME_1);
>>>>>>> 2410a761b069145b1053e84d08129d7b0589a5d3
}

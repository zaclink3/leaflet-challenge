


// Create the tile layer that will be the background of our map.
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(statusQuake) {
  var quakeMarker = [];

  // Define a function to calculate marker size based on earthquake magnitude
  function markerSize(magnitude) {
    return magnitude * 5000;
  }

  var colorScale = d3.scaleLinear()
  .domain([0, 20])
    // d3.max(statusQuake.features, function(d) { return d.geometry.coordinates[2]; })])
  .range(["green", "red"]); // set the color range from green to red


  // Loop through the features array and create a circle marker for each earthquake
  for (var i = 0; i < statusQuake.features.length; i++) {
    var coordinates = statusQuake.features[i].geometry.coordinates;
    var magnitude = statusQuake.features[i].properties.mag;
    var depth = coordinates[2];

    quakeMarker.push(
      L.circle([coordinates[1], coordinates[0]], {
        stroke: false,
        fillOpacity: 0.75,
        color: "white",
        fillColor: colorScale(depth),
        radius: markerSize(magnitude)
      })
    );
  }

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  });

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a layer group for the earthquakes markers
  var earthquakes = L.layerGroup(quakeMarker)
 

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object.
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Define a map object.
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, topo]
  })

  // Pass our map layers to our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);
})




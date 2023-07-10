let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
const earthquake = d3.json(url);
console.log("Earthwake json is:", earthquake);

function chooseColor(depth) {
    var red=255-(.2*depth);
    var green=125-(.4*depth);
    var blue=.25*depth
    console.log(depth);
    console.log("rgb(" + red + "," + green + ","+blue+")")
    return "rgb(" + red + "," + green + ","+blue+")"
  };

  

d3.json(url).then(function(data){
    L.geoJson(data, {
        // Styling each feature (in this case, a neighborhood)
        pointToLayer: function(feature,latlng) {
          return L.circleMarker(latlng,
            {
                radius: 2*feature.properties.mag,
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "#800080",
                weight: 1,
                opacity: 1,
                fillOpacity: 1
            });  
        }, 
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h2>" + Date(feature.properties.time) + "</h2> <hr> <h3> Magnitude: "
            + feature.properties.mag + "</h3> <hr> <h4> Depth: "
            + feature.geometry.coordinates[2] + "<h4>");
        }
    }).addTo(myMap);
});



var myMap = L.map("map", {
    center: [15, 45],
    zoom: 2,
  });
  
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap)

// Add legend
let legend = L.control({ position: 'bottomright' });


// Create a function to generate the legend content
function createLegend() {
  const grades = [0, 10, 100, 200, 300];
  let legendContent = '<div class="legend"><strong>Earthquake Depth</strong><br>';

  for (let i = 0; i < grades.length; i++) {
    const color = chooseColor(grades[i]);
    const nextGrade = grades[i + 1];

    legendContent +=
      '<i style="background:' +
      color +
      '"></i> ' +
      grades[i] +
      '<br>';
  }

  legendContent += '</div>';
  console.log(legendContent)
  return legendContent;
}

// Add the legend to the map
legend.onAdd = function (myMap) {
  const div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = createLegend();
  return div;
};

legend.addTo(myMap);
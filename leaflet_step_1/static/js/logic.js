// Define letiables for our base layers
let streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
    accessToken: API_KEY
})
let dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
// Create our map, giving it the streetmap and earthquakes layers to display on load
let myMap = L.map("map", {
    center: [
    37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap]
    // layers: [streetmap, earthquakes]
});
//can't figure out how to make color based on depth
function getColor(d) { 
    return  d < 70 ? "e7e1ef":
            d < 300 ? "c994c7":
            d < 700 ? "dd1c77":
                    "ce1256";
}

let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function(data) {
    let earthquakes = L.geoJSON(data, {
        //another function called on each feature check it out
        pointToLayer: function style(feature, latlng) {
        //   console.log(latlng)
          let geojsonMarkerOptions = {
            //can add other styling properties
            radius: feature.properties.mag * 5,
            fillColor: getColor(feature.geometry.coordinates[2]),
            weight: 1,
            // color: "lightblue",
            opacity: 2, 
            fillOpacity: .8,
          };
        return L.circleMarker(latlng, geojsonMarkerOptions);
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3> <hr> <p>" + new Date(feature.properties.time) + "</p>" + "<p>" + "Magnitutde (-1.0, 10.0): " + (feature.properties.mag) + "</p>" + "Significance (0-1000): " + (feature.properties.sig) + "</p>");
        }
        
    });
      earthquakes.addTo(myMap);

      // Define a baseMaps object to hold our base layers. Need more basemaps. Then add to 'layers'
    let baseMaps = {
        "Street Map": streetmap,
        "Dark Map" : dark,
        "Topography Map" : OpenTopoMap
    };
    
    // Create overlay object to hold our overlay layer
    let overlayMaps = {
        Earthquakes: earthquakes
    };
    // Create a control to toggle different maps and earthquakes
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {

        let div = L.DomUtil.create('div', 'info legend'),
            grades = [-10-10, 10-30, 30-50, 50-70, 70-90, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
});

  

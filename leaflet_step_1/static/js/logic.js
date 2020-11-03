// Define letiables for our base layers
let Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});
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
    layers: [Stamen_Terrain]
    // layers: [streetmap, earthquakes]
});
//can't figure out how to make color based on colors
function getColor(d) {
    console.log(d); 
    let color = " "
    if (d < 10) {
        color = '#39edfa'
    }
    else if (d < 30) {
        color = '#3425bb'
    }
    else if (d < 50) {
        color = "#bb257c"
    }
    else {
        color = "#dbeb06";
    }
    return color;
};


let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, function(data) {
    console.log(data);
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
          console.log(feature);

        return L.circleMarker(latlng, geojsonMarkerOptions);
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3> <hr> <p>" + new Date(feature.properties.time) + "</p>" + "<p>" + "Magnitutde (-1.0, 10.0): " + (feature.properties.mag) + "</p>" + "Significance (0-1000): " + (feature.properties.sig) + "</p>");
        }
        
    });
      earthquakes.addTo(myMap);

      // Define a baseMaps object to hold our base layers. Need more basemaps. Then add to 'layers'
    let baseMaps = {
        "Street Map": Stamen_Terrain,
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
            labels = ["less than 10", "10-30", "30-50", "50 +"],
            colors = ['#39edfa', '#3425bb', "#bb257c", "#dbeb06"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < colors.length; i++) {
            div.innerHTML +=
                '<div> <i style="background:' + (colors[i]) + '"></i> ' + labels[i] + "</div>";
        }
        return div;
    };

    legend.addTo(myMap);
});

  

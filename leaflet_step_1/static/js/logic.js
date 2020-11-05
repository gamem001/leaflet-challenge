// use as basemap
let Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});

//another basemap layer
let dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

//last basemap layer
var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create our map, giving it the initial basemap for initial load
let myMap = L.map("map", {
    center: [
    37.09, -95.71
    ],
    zoom: 5,
    layers: [Stamen_Terrain]
});
//use 'getColor' to define color pallette for earthquake depths
function getColor(d) {
    // console.log(d); 
    let color = " "
    if (d < 10) {
        color = '#f1fa6e' 
    }
    else if (d < 30) {
        color = '#2ddce9'
    }
    else if (d < 50) {
        color = "#bb257c"
    }
    else {
        color = "#2719a1";
    }
    return color;
};

//link to pull data from
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//use d3 to pull data from link above. Use pointToLayer for latlng, add styling properties.
d3.json(link, function(data) {
    // console.log(data);
    let earthquakes = L.geoJSON(data, {
        pointToLayer: function style(feature, latlng) {
        //   console.log(latlng)
          let geojsonMarkerOptions = {
            radius: feature.properties.mag * 5,
            fillColor: getColor(feature.geometry.coordinates[2]),
            weight: 1,
            opacity: 1, 
            fillOpacity: .8,
          };
        //   console.log(feature);

        return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        
        //use onEAchFeature to create popups for each marker. 
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3> <hr> <p>" + new Date(feature.properties.time) + "</p>" + "<p>" + "Magnitutde (-1.0, 10.0): " + (feature.properties.mag) + "</p>" + "Significance (0-1000): " + (feature.properties.sig) + "</p>");
        }
        
    });
      earthquakes.addTo(myMap);

      // Define a baseMaps object to hold our base layers. 
    let baseMaps = {
        "Terrain": Stamen_Terrain,
        "Dark Map" : dark,
        "Topography Map" : OpenTopoMap
    };
    
    // Create overlay object to hold our overlay layer: earthquakes.
    let overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create a control to toggle different maps and earthquakes
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //create legend on bottom right of screen.
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {

        let div = L.DomUtil.create('div', 'info legend'),
            labels = ["less than 10", "10-30", "30-50", "50 +"],
            colors = ['#f1fa6e', '#2ddce9', "#bb257c", "#2719a1"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < colors.length; i++) {
            div.innerHTML +=
                '<div> <i style="background:' + (colors[i]) + '"></i> ' + labels[i] + "</div>";
        }
        return div;
    };

    legend.addTo(myMap);
});

  

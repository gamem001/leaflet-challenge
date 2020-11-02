// Define letiables for our base layers
let streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
    accessToken: API_KEY
})
// Create our map, giving it the streetmap and earthquakes layers to display on load
let myMap = L.map("map", {
    center: [
    37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap]
    // layers: [streetmap, earthquakes]
});



d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
    console.log(data)
    let earthquakes = L.geoJSON(data, {
        //another function called on each feature check it out
        pointToLayer: function (feature, latlng) {
        //   console.log(latlng)
          let geojsonMarkerOptions = {
            //can add other styling properties
            radius: feature.properties.mag * 5,
            fillColor: "teal",
            weight: 1,
            color: "lightblue",
            opacity: .5, 
            fillOpacity: 0.8,
          };
        return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3> <hr> <p>" + new Date(feature.properties.time) + "</p>");
        }
    });
      earthquakes.addTo(myMap);
    
    let earthquakeLayer = L.geoJSON(data.features, {
        onEachFeature: createPopups
    });
      // Define a baseMaps object to hold our base layers. Need more basemaps. Then add to 'layers'
    let baseMaps = {
        "Street Map": streetmap
    };
    // Create overlay object to hold our overlay layer
    let overlayMaps = {
        Earthquakes: earthquakes,
        earthquakeLayer: earthquakeLayer
    };
    // Create a control to toggle different maps and earthquakes
    L.control.layers(baseMaps, overlayMaps, earthquakeLayer, {
        collapsed: false
    }).addTo(myMap);
});

  

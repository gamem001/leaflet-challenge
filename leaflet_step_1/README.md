Visualizing Data with Leaflet

## Background

Welcome to the United States Geological Survey, or USGS for short! The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.

The USGS is interested in building a new set of tools that will allow them visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. Their hope is that being able to visualize their data will allow them to better educate the public and other government organizations (and hopefully secure more funding..) on issues facing our planet.

## Basic Visualization

1. **Retrieving a data set**

   The USGS provides earthquake data in a number of different formats, updated every 5 minutes. For the purpose of this project, the data set used was "The Past 7 days, All Eearthquakes" on the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page.  

2. **Import & Visualize the Data**

   *Create a map using Leaflet that plots all of the earthquakes from the data set based on longitude and latitude.

   * Allow data markers to reflect the magnitude of the earthquakes by size. Earthquakes with higher magnitudes appear larger. 
   
   *Allow data markers to reflect the depth of the earthqakes by color. Earthquakes with greater depth should appear darker in color.

   * Included popups that provide additional information about the earthquake when a marker is clicked.

   * Created a legend that will provide context for the map data.

### Copyright

Trilogy Education Services © 2019. All Rights Reserved.

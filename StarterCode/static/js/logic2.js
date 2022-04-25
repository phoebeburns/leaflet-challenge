
// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createMap(data.features);
});

// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright"<OpenStreetMap</a< contributors'
})

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright"<OpenStreetMap</a< contributors, <a href="http://viewfinderpanoramas.org"<SRTM</a< | Map style: &copy; <a href="https://opentopomap.org"<OpenTopoMap</a< (<a href="https://creativecommons.org/licenses/by-sa/3.0/"<CC-BY-SA</a<)'
});

// Create a baseMaps object.
var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};


function getColor(d){
    switch (true) {
        case d < 10:
            mcolor = "red";
            break;
        case d < 15:
            mcolor = "orange";
            break;
        case d < 25:
            mcolor = "yellow";
            break;
        case d < 150:
            mcolor = "green";
            break;
        default:
            mcolor = "blue"
    }

    return mcolor
}

var myMap = L.map("map", {
    center: [
        -43.382, 10.7447, 10
    ],
    zoom: 1,
    layers: [street]
})


function createMap(earthquakeData) {

    let earthquakes = L.geoJSON(earthquakeData);


    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(earthquakeData, {
        onEachFeature: function (feature, layer) {
            // console.log(feature.properties.alert)
            // x = feature.geometry.coordinates[2]


            let marker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                fillOpacity: 0.75,
                color: getColor(feature.geometry.coordinates[2]),
                fillColor: getColor(feature.geometry.coordinates[2]),
                radius: feature.properties.mag * 50000,
                layer: earthquakes
            });

            marker.addTo(myMap);
            marker.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>
                                  <hr>Maximum reported intensity: ${feature.properties.cdi}</p>
                                  <hr>Depth: ${feature.geometry.coordinates[2]}</p>`
            )
      }

      

    })

}



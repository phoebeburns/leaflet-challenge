
// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createMap(data.features);
});

// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create a baseMaps object.
var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};


function createMap(earthquakeData) {

    let earthquakes = L.geoJSON(earthquakeData);

    var myMap = L.map("map", {
        center: [
            -43.382, 10.7447, 10
        ],
        zoom: 1,
        layers: [street]
    })


    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(earthquakeData, {
        onEachFeature: function (feature, layer) {
            // console.log(feature.properties.alert)
            // x = feature.geometry.coordinates[2]

            switch (feature.geometry.coordinates[2]) {
                case feature.geometry.coordinates[2] < 10:
                    mcolor = "red";
                    break;

                case feature.geometry.coordinates[2] < 15:
                    mcolor = "orange";
                    break;

                case feature.geometry.coordinates[2] < 25:
                    mcolor = "yellow";
                    break;

                case feature.geometry.coordinates[2] < 150:
                    mcolor = "green";
                    break;

                default:
                    mcolor = "blue"

            }
            console.log(mcolor)
            console.log(feature.geometry.coordinates[2])
            let marker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                fillOpacity: 0.75,
                color: mcolor,
                fillColor: mcolor,
                radius: Math.sqrt(10^feature.properties.mag)*100,
                layer: earthquakes
            });

            // function getColor(d) {
            //     return x > 5000000 ? ‘#7a0177’ :
            //     d > 200000? ‘#BD0026’ :
            //     d > 80000? ‘#E31A1C’ :
            //     d > 10000? ‘#FC4E2A’ :
            //     d > 5000 ? ‘#FD8D3C’ :
            //     d > 500 ? ‘#FEB24C’ :
            //     d > 0 ? ‘#FED976’ :
            //     ‘#FFEDA0’;
            //     }


            marker.addTo(myMap);
            marker.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>
                                  <hr>Maximum reported intensity: ${feature.properties.cdi}</p>
                                  <hr>Depth: ${feature.geometry.coordinates[2]}</p>`
            )
        }
    })


}
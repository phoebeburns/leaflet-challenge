
// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createMap(data.features);
});

// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright"<OpenStreetMap</a< contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright"<OpenStreetMap</a< contributors, <a href="http://viewfinderpanoramas.org"<SRTM</a< | Map style: &copy; <a href="https://opentopomap.org"<OpenTopoMap</a< (<a href="https://creativecommons.org/licenses/by-sa/3.0/"<CC-BY-SA</a<)'
});

// Create a baseMaps object.
let baseMaps = {
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

let map = L.map("map", {
    center: [
        -43.382, 10.7447, 10
    ],
    zoom: 1,
    layers: [street]
})

let legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {

    let div = L.DomUtil.create("div", "info legend"),
        labels = ['<strong>Categories</strong>'],
        categories = ["0 - 9", "10 - 24", "25 - 74", "75 - 150", ">= 150"];
        categories2 = ["5", "15","50", "100","199"]

    div.innerHTML = '';
    for (var i = 0; i < categories2.length; i++) {
        labels.push(
            '<i class="circle" style="background:' + getColor(categories2[i]) + '"></i> ' +
            (categories[i] ? categories[i] : '+'));
    }
    div.innerHTML = labels.join('<br>');
    console.log(labels)
};

legend.addTo(map);


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

            marker.addTo(map);
            marker.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>
                                  <hr>Maximum reported intensity: ${feature.properties.cdi}</p>
                                  <hr>Depth: ${feature.geometry.coordinates[2]}</p>`
            )
      }

      

    })

}



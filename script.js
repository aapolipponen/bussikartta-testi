// Create a Leaflet map centered on Turku, Finland
const map = L.map('map').setView([60.45065, 22.26296], 13);

// Add a base map layer (You can replace 'mapbox/streets-v11' with your preferred tileset)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Custom icons for buses and bus stops
const busIcon = L.icon({
    iconUrl: 'https://fonts.gstatic.com/s/i/materialicons/directions_bus/v12/24px.svg',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
});

const busStopIcon = L.icon({
    iconUrl: 'https://fonts.gstatic.com/s/i/materialicons/departure_board/v11/24px.svg',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
});

// Function to fetch loading points and cache them
async function fetchAndCacheLoadingPoints() {
    try {
        const response = await fetch('http://data.foli.fi/geojson/poi/loading_points');
        const data = await response.json();

        // Store the loading points data in local storage
        localStorage.setItem('loadingPoints', JSON.stringify(data));

        // Create a GeoJSON layer with custom icons and add it to the map
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                if (feature.properties.category === "LOADING_POINT") {
                    return L.marker(latlng, { icon: busStopIcon });
                }
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.name) {
                    layer.bindPopup(feature.properties.name + "<br>" + feature.properties.address);
                }
            }
        }).addTo(map);

        // Fit the map to show all markers
        map.fitBounds(L.geoJSON(data).getBounds());
    } catch (error) {
        console.error('Error fetching/loading loading points:', error);
    }
}

// Fetch and cache loading points if not already cached
if (!localStorage.getItem('loadingPoints')) {
    fetchAndCacheLoadingPoints();
} else {
    // Load cached loading points data and create the GeoJSON layer
    const cachedLoadingPoints = JSON.parse(localStorage.getItem('loadingPoints'));
    L.geoJSON(cachedLoadingPoints, {
        pointToLayer: function (feature, latlng) {
            if (feature.properties.category === "LOADING_POINT") {
                return L.marker(latlng, { icon: busStopIcon });
            }
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name + "<br>" + feature.properties.address);
            }
        }
    }).addTo(map);

    // Fit the map to show all markers
    map.fitBounds(L.geoJSON(cachedLoadingPoints).getBounds());
}

var busMarkers = [];

// Function to update bus locations
function updateBusLocations() {
    axios.get('https://data.foli.fi/siri/vm')
        .then(response => {
            clearMarkers();
            if (response.data && response.data.result && response.data.result.vehicles) {
                addMarkers(response.data.result.vehicles);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Clear existing markers
function clearMarkers() {
    busMarkers.forEach(marker => map.removeLayer(marker));
    busMarkers = [];
}

// Add markers to the map
function addMarkers(vehicles) {
    for (var id in vehicles) {
        var bus = vehicles[id];
        if (bus.latitude && bus.longitude && bus.publishedlinename) {
            var marker = L.marker([bus.latitude, bus.longitude])
                .bindPopup(`<b>${bus.publishedlinename}</b>`)
                .addTo(map);
            busMarkers.push(marker);
        }
    }
}

// Automatically fetch and display buses on the map
updateBusLocations();
setInterval(updateBusLocations, 2800); // Refresh bus locations every 2.8s

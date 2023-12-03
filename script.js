var map = L.map('map').setView([60.45, 22.25], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

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

// Set interval slightly less than 3 seconds
setInterval(updateBusLocations, 2800);

// Initial call to start the process
updateBusLocations();
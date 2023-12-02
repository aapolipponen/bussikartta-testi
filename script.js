var map = L.map('map').setView([60.45, 22.25], 13); // Adjust the center and zoom level to your preference
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var busMarkers = [];

function updateBusLocations() {
    axios.get('http://data.foli.fi/siri/vm')
        .then(function (response) {
            // Clear existing markers
            busMarkers.forEach(marker => map.removeLayer(marker));
            busMarkers = [];

            // Add new markers
            var vehicles = response.data.result.vehicles;
            for (var id in vehicles) {
                var bus = vehicles[id];
                var marker = L.marker([bus.latitude, bus.longitude]).addTo(map);
                busMarkers.push(marker);
            }
        })
        .catch(function (error) {
            console.error('Error fetching data:', error);
        });
}

setInterval(updateBusLocations, 3000); // Update every 3 seconds
updateBusLocations();

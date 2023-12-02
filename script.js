var map = L.map('map').setView([60.45, 22.25], 13); // Adjust the center and zoom level to your preference
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var busMarkers = [];
function updateBusLocations() {
    const targetUrl = 'http://data.foli.fi/siri/vm';

    axios.get(targetUrl)
        .then(function (response) {
            // Clear existing markers
            busMarkers.forEach(marker => map.removeLayer(marker));
            busMarkers = [];

            // Process each vehicle in the response
            if (response.data && response.data.result && response.data.result.vehicles) {
                var vehicles = response.data.result.vehicles;

                for (var vehicleId in vehicles) {
                    var vehicle = vehicles[vehicleId];
                    var marker = L.marker([vehicle.latitude, vehicle.longitude]).addTo(map);
                    busMarkers.push(marker);
                }
            } else {
                console.error('Unexpected response format:', response.data);
            }
        })
        .catch(function (error) {
            console.error('Error fetching data:', error);
        });
}

setInterval(updateBusLocations, 3000); // Update every 3 seconds
updateBusLocations();

var map = L.map('map').setView([60.45, 22.25], 13); // Adjust the center and zoom level to your preference
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var busMarkers = [];

console.log('Requesting data from:', targetUrl);
axios.get(targetUrl)
  .then(function (response) {
    // Handle response data
  })
  .catch(function (error) {
    console.error('Error fetching data:', error);
  });
}

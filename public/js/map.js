
// Leaflet Map Initialization

// Coordinates from backend are [Lng, Lat] (GeoJSON standard)
// Leaflet expects [Lat, Lng]
const coordinates = listing.geometry.coordinates; // [Lng, Lat]
const leafletCoords = [coordinates[1], coordinates[0]]; // Swap to [Lat, Lng]

const map = L.map('map').setView(leafletCoords, 9); // Initialize map

// Add OpenStreetMap tiles (Free, No Key required)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add Marker
const marker = L.marker(leafletCoords)
    .addTo(map)
    .bindPopup(`<h4>${listing.title}</h4><p>Approximate Location</p>`)
    .openPopup();

// Add a circle to show area
L.circle(leafletCoords, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.15,
    radius: 4000 // meters
}).addTo(map);

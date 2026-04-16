const map = L.map('map').setView([40.7128, -74.0060], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

let marker, circle;

/**
 * Procura por uma localizacao usando um endereco e atualiza o mapa com a localizacao encontrada.
 * @param {string} address - Endereco a ser pesquisado
 *
 */
export async function searchAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            updateMap(lat, lon); 
        } else {
            alert("Address not found!");
        }
    } catch (err) {
        console.error("Geocoding error:", err);
    }
}

/**
 * Atualiza a visualização do mapa com um novo local.
 * @param {number} lat - Latitude do local.
 * @param {number} lng - Longitude do local.
 * @param {number|null} accuracy - Precisão da localização.
 */
function updateMap(lat, lng, accuracy = null) {
    if (marker) map.removeLayer(marker);
    if (circle) map.removeLayer(circle);

    marker = L.marker([lat, lng]).addTo(map);
    
    if (accuracy) {
        circle = L.circle([lat, lng], { radius: accuracy }).addTo(map);
        map.fitBounds(circle.getBounds());
    } else {
        map.setView([lat, lng], 15);
    }
}

function error(err) {
    console.warn("Location access denied or unavailable.");
}


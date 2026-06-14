const map = L.map('map').setView(
    [37.490, 127.022],
    14
);

L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 19
    }
).addTo(map);

let marker;
let stops = [];

fetch("stops.json")
    .then(response => response.json())
    .then(data => {

        stops = data;

        stops.forEach(stop => {

            L.circleMarker(
                [stop.lat, stop.lng],
                {
                    radius: 6
                }
            )
            .addTo(map)
            .bindPopup(stop.name);

        });

    });

function getDistance(lat1, lon1, lat2, lon2) {

    const R = 6371000;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
}

navigator.geolocation.watchPosition(

    position => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (marker) {

            marker.setLatLng([lat, lng]);

        } else {

            marker = L.marker(
                [lat, lng]
            ).addTo(map);

        }

        map.setView([lat, lng]);

        const speed =
            Math.round(
                (position.coords.speed || 0) * 3.6
            );

        document.getElementById("speed").innerHTML =
            "속도 : " + speed + " km/h";

        if (stops.length > 0) {

            let nearestStop = null;
            let nearestDistance = 999999;

            stops.forEach(stop => {

                const distance = getDistance(
                    lat,
                    lng,
                    stop.lat,
                    stop.lng
                );

                if (distance < nearestDistance) {

                    nearestDistance = distance;
                    nearestStop = stop;

                }

            });

            if (nearestStop) {

                document.getElementById("nextStop").innerHTML =
                    "가까운 정류장 : " +
                    nearestStop.name;

                document.getElementById("distance").innerHTML =
                    "거리 : " +
                    Math.round(nearestDistance) +
                    "m";

            }

        }

    },

    error => {

        console.log(error);

    },

    {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
    }

);

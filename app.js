const map = L.map('map').setView([37.490, 127.022], 14);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom: 20
}
).addTo(map);

let gpsMarker;
let stops = [];

fetch('stops.json')
.then(response => response.json())
.then(data => {

stops = data;
stops.forEach(stop => {
    L.circleMarker(
        [stop.lat, stop.lng],
        {
            radius: 7,
            weight: 2
        }
    )
    .addTo(map)
    .bindPopup(
        '<b>' + stop.name + '</b><br>' +
        '순번 : ' + (stop.seq || '-') + '<br>' +
        '위도 : ' + stop.lat + '<br>' +
        '경도 : ' + stop.lng
    );
});

})
.catch(error => {

console.log('stops.json 로딩 오류', error);

});

function getDistance(lat1, lon1, lat2, lon2){

const R = 6371000;
const dLat = (lat2 - lat1) * Math.PI / 180;
const dLon = (lon2 - lon1) * Math.PI / 180;
const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
const c =
    2 *
    Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );
return R * c;

}

navigator.geolocation.watchPosition(

function(position){
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    if(gpsMarker){
        gpsMarker.setLatLng([lat, lng]);
    }else{
        gpsMarker = L.marker([lat, lng]).addTo(map);
    }
    const speed =
        Math.round(
            (position.coords.speed || 0) * 3.6
        );
    const speedDiv = document.getElementById('speed');
    if(speedDiv){
        speedDiv.innerHTML =
            '속도 : ' + speed + ' km/h';
    }
    let nearestStop = null;
    let nearestDistance = 999999;
    stops.forEach(stop => {
        const distance =
            getDistance(
                lat,
                lng,
                stop.lat,
                stop.lng
            );
        if(distance < nearestDistance){
            nearestDistance = distance;
            nearestStop = stop;
        }
    });
    if(nearestStop){
        const nextStopDiv =
            document.getElementById('nextStop');
        if(nextStopDiv){
            nextStopDiv.innerHTML =
                '가까운 정류장 : ' +
                nearestStop.name;
        }
        const distanceDiv =
            document.getElementById('distance');
        if(distanceDiv){
            distanceDiv.innerHTML =
                '거리 : ' +
                Math.round(nearestDistance) +
                'm';
        }
    }
},
function(error){
    console.log(error);
},
{
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 10000
}

);

map.on('click', function(e){

const lat = e.latlng.lat.toFixed(6);
const lng = e.latlng.lng.toFixed(6);
L.popup()
    .setLatLng(e.latlng)
    .setContent(
        '<b>좌표 추출 모드</b><br><br>' +
        '위도 : ' + lat + '<br>' +
        '경도 : ' + lng + '<br><br>' +
        'stops.json 입력용<br><br>' +
        '"lat": ' + lat + ',<br>' +
        '"lng": ' + lng
    )
    .openOn(map);

});

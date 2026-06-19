const map = L.map(‘map’).setView([37.490, 127.022], 14);

L.tileLayer(
‘https://tile.openstreetmap.org/{z}/{x}/{y}.png’,
{
maxZoom: 20
}
).addTo(map);

let gpsMarker;

let upStops = [];
let downStops = [];
let allStops = [];

let currentDirection = “상행”;

// =========================
// 정류장 로드
// =========================

fetch(‘stops.json’)
.then(response => response.json())
.then(data => {

upStops = data.upbound || [];
downStops = data.downbound || [];
allStops = [
    ...upStops,
    ...downStops
];
// 상행 마커
upStops.forEach(stop => {
    L.circleMarker(
        [stop.lat, stop.lng],
        {
            radius: 7,
            color: 'blue',
            weight: 2
        }
    )
    .addTo(map)
    .bindPopup(
        '<b>[상행]</b><br>' +
        stop.name
    );
});
// 하행 마커
downStops.forEach(stop => {
    L.circleMarker(
        [stop.lat, stop.lng],
        {
            radius: 7,
            color: 'red',
            weight: 2
        }
    )
    .addTo(map)
    .bindPopup(
        '<b>[하행]</b><br>' +
        stop.name
    );
});

})
.catch(error => {

console.log('stops.json 로딩 오류');
console.log(error);

});

// =========================
// 거리 계산
// =========================

function getDistance(
lat1,
lon1,
lat2,
lon2
){

const R = 6371000;
const dLat =
    (lat2 - lat1) *
    Math.PI / 180;
const dLon =
    (lon2 - lon1) *
    Math.PI / 180;
const a =
    Math.sin(dLat / 2) *
    Math.sin(dLat / 2)
    +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180)
    *
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

// =========================
// GPS 추적
// =========================

navigator.geolocation.watchPosition(

function(position){

const lat =
    position.coords.latitude;
const lng =
    position.coords.longitude;
if(gpsMarker){
    gpsMarker.setLatLng(
        [lat, lng]
    );
}else{
    gpsMarker =
        L.marker(
            [lat, lng]
        ).addTo(map);
}
const speed =
    Math.round(
        (position.coords.speed || 0)
        * 3.6
    );
const speedDiv =
    document.getElementById('speed');
if(speedDiv){
    speedDiv.innerHTML =
        '속도 : ' +
        speed +
        ' km/h';
}
// =====================
// 회차점 자동판단
// =====================
const artCenterDistance =
    getDistance(
        lat,
        lng,
        37.480295,
        127.013251
    );
const churchDistance =
    getDistance(
        lat,
        lng,
        37.504103,
        127.020694
    );
if(artCenterDistance < 100){
    currentDirection = "상행";
}
if(churchDistance < 100){
    currentDirection = "하행";
}
let targetStops =
    currentDirection === "상행"
    ? upStops
    : downStops;
let nearestStop = null;
let nearestDistance = 999999;
targetStops.forEach(stop => {
    const distance =
        getDistance(
            lat,
            lng,
            stop.lat,
            stop.lng
        );
    if(distance < nearestDistance){
        nearestDistance =
            distance;
        nearestStop =
            stop;
    }
});
if(nearestStop){
    const nextStopDiv =
        document.getElementById(
            'nextStop'
        );
    if(nextStopDiv){
        nextStopDiv.innerHTML =
            '방향 : ' +
            currentDirection +
            '<br>' +
            '가까운 정류장 : ' +
            nearestStop.name;
    }
    const distanceDiv =
        document.getElementById(
            'distance'
        );
    if(distanceDiv){
        distanceDiv.innerHTML =
            '거리 : ' +
            Math.round(
                nearestDistance
            ) +
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

// =========================
// 좌표 확인용
// =========================

map.on(‘click’, function(e){

const lat =
    e.latlng.lat.toFixed(6);
const lng =
    e.latlng.lng.toFixed(6);
L.popup()
.setLatLng(e.latlng)
.setContent(
    '<b>좌표 정보</b><br><br>' +
    '위도 : ' +
    lat +
    '<br>' +
    '경도 : ' +
    lng
)
.openOn(map);

});
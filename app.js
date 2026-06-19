alert("app.js 시작");
const map = L.map('map').setView([37.490, 127.022], 14);

L.tileLayer(
‘https://tile.openstreetmap.org/{z}/{x}/{y}.png’,
{
maxZoom: 20
}
).addTo(map);

let gpsMarker = null;
let upStops = [];
let downStops = [];
let currentDirection = ‘상행’;

// =========================
// 거리 계산
// =========================

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

// =========================
// 정류장 로드
// =========================

fetch(’./stops.json’)
.then(response => {

if (!response.ok) {
  throw new Error(
    'stops.json 로드 실패 : ' +
    response.status
  );
}
return response.json();

})
.then(data => {

upStops = data.upbound || [];
downStops = data.downbound || [];
console.log(
  '상행:',
  upStops.length,
  '하행:',
  downStops.length
);
// 상행 표시
upStops.forEach(stop => {
  L.circleMarker(
    [stop.lat, stop.lng],
    {
      radius: 6,
      color: 'blue',
      weight: 2
    }
  )
  .addTo(map)
  .bindPopup(
    '[상행] ' +
    stop.name
  );
});
// 하행 표시
downStops.forEach(stop => {
  L.circleMarker(
    [stop.lat, stop.lng],
    {
      radius: 6,
      color: 'red',
      weight: 2
    }
  )
  .addTo(map)
  .bindPopup(
    '[하행] ' +
    stop.name
  );
});

})
.catch(error => {

alert(
  'stops.json 오류\n\n' +
  error.message
);
console.error(error);

});

// =========================
// GPS 추적
// =========================

navigator.geolocation.watchPosition(

function(position) {

const lat =
  position.coords.latitude;
const lng =
  position.coords.longitude;
if (gpsMarker) {
  gpsMarker.setLatLng(
    [lat, lng]
  );
} else {
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
if (speedDiv) {
  speedDiv.innerHTML =
    '속도 : ' +
    speed +
    ' km/h';
}
// 회차점 판단
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
if (artCenterDistance < 100) {
  currentDirection = '상행';
}
if (churchDistance < 100) {
  currentDirection = '하행';
}
const targetStops =
  currentDirection === '상행'
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
  if (distance < nearestDistance) {
    nearestDistance = distance;
    nearestStop = stop;
  }
});
if (nearestStop) {
  const nextStopDiv =
    document.getElementById(
      'nextStop'
    );
  if (nextStopDiv) {
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
  if (distanceDiv) {
    distanceDiv.innerHTML =
      '거리 : ' +
      Math.round(
        nearestDistance
      ) +
      'm';
  }
}

},

function(error) {

console.error(error);

},

{
enableHighAccuracy: true,
maximumAge: 1000,
timeout: 10000
}

);

// =========================
// 지도 클릭 좌표 확인
// =========================

map.on(‘click’, function(e) {

const lat =
e.latlng.lat.toFixed(6);

const lng =
e.latlng.lng.toFixed(6);

L.popup()
.setLatLng(e.latlng)
.setContent(
‘좌표 정보’ +
’위도 : ’ + lat +
‘’ +
’경도 : ’ + lng
)
.openOn(map);

});
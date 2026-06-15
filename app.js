const map = L.map('map').setView([37.490, 127.022], 14);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom: 20
}
).addTo(map);

alert('지도 로딩 성공');

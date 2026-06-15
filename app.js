const map = L.map('map').setView([37.490, 127.022], 14);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    maxZoom: 20
}
).addTo(map);

// 지도 클릭 시 좌표 표시
map.on('click', function(e){

    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);

    alert(
        '위도 : ' + lat +
        '\n경도 : ' + lng
    );

});

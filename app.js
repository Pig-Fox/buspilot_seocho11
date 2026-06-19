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
map.on('click', function(e){

    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);

    const stopName = prompt(
        '정류장명을 입력하세요',
        ''
    );

    L.popup()
        .setLatLng(e.latlng)
        .setContent(
            '<b>정류장 정보</b><br><br>' +
            '정류장명 : ' + (stopName || '미입력') + '<br><br>' +
            '위도 : ' + lat + '<br>' +
            '경도 : ' + lng + '<br><br>' +
            'stops.json 입력용<br><br>' +
            '{<br>' +
            '"name": "' + (stopName || '') + '",<br>' +
            '"lat": ' + lat + ',<br>' +
            '"lng": ' + lng + '<br>' +
            '}'
        )
        .openOn(map);

});
});

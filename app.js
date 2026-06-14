const map = L.map('map').setView(
[37.48028,127.01324],
15
);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

let marker;

navigator.geolocation.watchPosition(
(pos)=>{

const lat = pos.coords.latitude;
const lng = pos.coords.longitude;

if(marker){
marker.setLatLng([lat,lng]);
}else{
marker = L.marker([lat,lng])
.addTo(map);
}

map.setView([lat,lng]);

document.getElementById("speed")
.innerHTML =
"속도 : " +
Math.round(
(pos.coords.speed || 0)*3.6
)
+" km/h";

},
(err)=>{
console.log(err);
},
{
enableHighAccuracy:true
}
);

const map = L.map('map').setView(
[37.490,127.022],
14
);

L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

let marker;
let stops=[];

fetch("stops.json")
.then(r=>r.json())
.then(data=>{
stops=data;
});

function getDistance(lat1,lng1,lat2,lng2){

const R=6371000;

const dLat=(lat2-lat1)*Math.PI/180;
const dLng=(lng2-lng1)*Math.PI/180;

const a=
Math.sin(dLat/2)**2+
Math.cos(lat1*Math.PI/180)*
Math.cos(lat2*Math.PI/180)*
Math.sin(dLng/2)**2;

return R*2*Math.atan2(
Math.sqrt(a),
Math.sqrt(1-a)
);
}

navigator.geolocation.watchPosition(
(pos)=>{

const lat=pos.coords.latitude;
const lng=pos.coords.longitude;

if(marker){
marker.setLatLng([lat,lng]);
}else{
marker=L.marker([lat,lng]).addTo(map);
}

map.setView([lat,lng]);

let nearest=null;
let nearestDist=999999;

for(let stop of stops){

const d=getDistance(
lat,lng,
stop.lat,stop.lng
);

if(d<nearestDist){
nearestDist=d;
nearest=stop;
}
}

if(nearest){

document.getElementById(
"nextStop"
).innerHTML=
"가까운 정류장 : "
+nearest.name;

document.getElementById(
"distance"
).innerHTML=
Math.round(nearestDist)
+" m";
}

document.getElementById(
"speed"
).innerHTML=
"속도 : "
+
Math.round(
(pos.coords.speed||0)*3.6
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

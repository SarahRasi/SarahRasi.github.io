
let stop = {
    nr: 22,
    name: "Napier",
    lat: -39.4928444,
    lng: 176.9120178,
    user: "SarahRasi",
    wikipedia: "https://de.wikipedia.org/wiki/Napier_(Neuseeland)"
};
console.log(stop);
console.log(stop.name)
console.log(stop.lat)
console.log(stop.lng)
console.log(stop.wikipedia)

const map = L.map("map", {
    center: [-39.4928444 , 176.9120178 ],
    zoom: 13,
    layers: [
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")  //s server, x longitude, y latitude
    ] 
});

let mrk = L.marker([ -39.4928444 , 176.9120178 ]).addTo(map);
mrk.bindPopup("Napier").openPopup();

console.log(document.querySelector("#map")); //# für css ID; Karte initialisiert und DIV in der Konsole angezeigt


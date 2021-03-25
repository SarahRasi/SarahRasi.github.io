
let stop = {
    nr: 21,
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
    //center: [stop.lat , stop.lng],
   // zoom: 13,
    layers: [
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")  //s server, x longitude, y latitude
    ] 
});

console.log(ROUTE);
for(let entry of ROUTE) {
    console.log(entry);

    let mrk = L.marker([ entry.lat , entry.lng ]).addTo(map);
    mrk.bindPopup(`
        <h4>Stop ${entry.nr}: ${entry.name}</h4>
        <p><i class="fas fa-external-link-alt mr-3"></i><a href="${entry.wikipedia}">Read about stop in Wikipedia</a></p>
    `); //`` 

    if (entry.nr == 21) {
        map.setView([entry.lat, entry.lng], 13);
        mrk.openPopup();
    }
}



//console.log(document.querySelector("#map")); //# für css ID; Karte initialisiert und DIV in der Konsole angezeigt


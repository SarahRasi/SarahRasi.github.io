console.log("Hello World!");
console.log(L); //L für leaflet

const map = L.map("map", {
    center: [-39.4928444 , 176.9120178 ],
    zoom: 13,
    layers: [
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")  //s server, x longitude, y latitude
    ]
});

console.log(document.querySelector("#map")); //# für css ID; Karte initialisiert und DIV in der Konsole angezeigt


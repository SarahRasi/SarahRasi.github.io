
let basemapGray = L.tileLayer.provider('BasemapAT.grau');
//https://leafletjs.com/reference-1.7.1.html#tilelayer

let map = L.map("map", {
    //https://leafletjs.com/reference-1.7.1.html#map-factory
    center: [47, 11],
    zoom: 9,
    layers: [
        basemapGray
    ]
});

let overlays = {
    stations: L.featureGroup(),
    temperature: L.featureGroup(),
    snowheight: L.featureGroup(),
    windspeed: L.featureGroup(),
    winddirection: L.featureGroup(),
    humidity: L.featureGroup(),
};
console.log(overlays.stations);

let layerControl = L.control.layers({
    //https://leafletjs.com/reference-1.7.1.html#control-layers
    "BasemapAT.grau": basemapGray,
    "BasemapAT.orthofoto": L.tileLayer.provider('BasemapAT.orthofoto'),
    "BasemapAT.terrain": L.tileLayer.provider('BasemapAT.terrain'),
    "BasemapAT.surface": L.tileLayer.provider('BasemapAT.surface'),
    "BasemapAT.highdpi": L.tileLayer.provider('BasemapAT.highdpi'),
    "BasemapAT.overlay": L.tileLayer.provider('BasemapAT.overlay'),
    "BasemapAT.overlay+orthofoto": L.layerGroup([
        L.tileLayer.provider('BasemapAT.orthofoto'),
        L.tileLayer.provider('BasemapAT.overlay')
        //https://leafletjs.com/reference-1.7.1.html#tilelayer
    ])
}, {
    "Wetterstationen Tirol": overlays.stations,
    "Temperatur (°C)": overlays.temperature,
    "Schneehöhe (cm)": overlays.snowheight,
    "Windgeschwindigkeit (km/h)": overlays.windspeed,
    "Windrichtung": overlays.winddirection,
    "Luftfeuchtigkeit (%)": overlays.humidity,
},{
    collapsed: false  
}).addTo(map);

overlays.temperature.addTo(map);
L.control.scale({
    imperial: false
}).addTo(map);

L.control.rainviewer({
    position: 'bottomleft',
    nextButtonText: '>',
    playStopButtonText: 'Play/Stop',
    prevButtonText: '<',
    positionSliderLabelText: "Hour:",
    opacitySliderLabelText: "Opacity:",
    animationInterval: 500,
    opacity: 0.5
}).addTo(map);

let getColor = (value, colorRamp) => {
    for (let rule of colorRamp) {
        if (value >= rule.min && value < rule.max) {
            return rule.col
        }
    }
    return "black";
};

let getDirection = (direction, minmax) => {
    for (let rule of minmax) {
        if ((direction >= rule.min) && (direction < rule.max)) {
            return rule.dir
        }
    }
    return "black";

};

let newLabel = (coords, options) => {
    let color = getColor(options.value, options.colors);
    let label = L.divIcon({
        html: `<div style="background-color:${color}">${options.value}</div>`,
        className: "text-label"
    })
    let marker = L.marker([coords[1], coords[0]], {
        icon: label,
        title: `${options.station} (${coords[2]}m)`
    });
    return marker;
};


let newDirection = (coords, options) => {
    let direction = getDirection(options.value, options.directions);
    let label = L.divIcon({
        html: `<div>${direction}</div>`,
        className: "text-label",
    })
    let marker = L.marker([coords[1], coords[0]], {
        icon: label,
        title: `${options.station} (${coords[2]}m)`
    });
    return marker;
};



let awsUrl = 'https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson';

fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
        console.log('Daten konvertiert: ', json);
        for (station of json.features) {
            // console.log('Station: ', station);
            let marker = L.marker([
                //https://leafletjs.com/reference-1.7.1.html#marker
                station.geometry.coordinates[1],
                station.geometry.coordinates[0]
            ]);
            let formattedDate = new Date(station.properties.date);
            marker.bindPopup(`
            <h3>${station.properties.name}</h3>
            <ul>
                <li>Datum: ${formattedDate.toLocaleString("de")}</li>
                <li>Temperatur: ${station.properties.LT || '?'} C</li>
                <li>Höhe der Wetterstation: ${station.geometry.coordinates[2] || '?'} m</li>
                <li>Schneehöhe: ${station.properties.HS || '?'} cm</li>
                <li>Luftfeuchtigkeit: ${station.properties.RH || '?'} %</li>
                <li>Windgeschwindigkeit: ${station.properties.WG || '?'} km/h</li>
                <li>Windrichtung: ${getDirection(station.properties.WR,DIRECTIONS) || "?"} ° </li>
            </ul>
            <a target="_blank" href="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
            `);

            marker.addTo(overlays.stations);
            if (typeof station.properties.HS == "number") {
                let marker = newLabel(station.geometry.coordinates, {
                    value: station.properties.HS.toFixed(0),
                    colors: COLORS.snowheight,
                    station: station.properties.name
                });
                marker.addTo(overlays.snowheight);

            }
            if (typeof station.properties.WG == "number") {
                let marker = newLabel(station.geometry.coordinates, {
                    value: station.properties.WG.toFixed(0),
                    colors: COLORS.windspeed,
                    station: station.properties.name
                });
                marker.addTo(overlays.windspeed);
        
            }
            if (typeof station.properties.LT == "number") {
                let marker = newLabel(station.geometry.coordinates, {
                    value: station.properties.LT.toFixed(1),
                    colors: COLORS.temperature,
                    station: station.properties.name
                });
                marker.addTo(overlays.temperature);
            } 
            if (typeof station.properties.RH == "number" && station.properties.RH > 0) {
                let marker = newLabel(station.geometry.coordinates, {
                    value: station.properties.RH.toFixed(0),
                    colors: COLORS.humidity,
                    station: station.properties.name
                });
                marker.addTo(overlays.humidity);
            }
            if (typeof station.properties.WR == "number" && station.properties.RH > 0) {
                let marker = newDirection(station.geometry.coordinates, {
                    value: station.properties.WR,
                    directions: DIRECTIONS,
                    station: station.properties.name
                });
                marker.addTo(overlays.winddirection);
            }
        }
        // set map view to all stations
        map.fitBounds(overlays.stations.getBounds());
    });

    //newLabel(...,...).addTo(overlays.temperature)
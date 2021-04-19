
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
}).addTo(map);

let awsUrl = 'https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson';

let awsLayer = L.featureGroup();
//https://leafletjs.com/reference-1.7.1.html#featuregroup
layerControl.addOverlay(awsLayer, "Wetterstationen Tirol");
awsLayer.addTo(map);
let snowLayer = L.featureGroup();
layerControl.addOverlay(snowLayer, "Schneehöhe");
snowLayer.addTo(map);
let windLayer = L.featureGroup();
layerControl.addOverlay(windLayer, "Windgeschwindigkeit");
windLayer.addTo(map);
let tempLayer = L.featureGroup();
layerControl.addOverlay(tempLayer, "Lufttemperatur");
tempLayer.addTo(map);

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
                <li>Windrichtung: ${station.properties.WR || '?'} </li>
            </ul>
            <a target="_blank" href="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
            `);

            marker.addTo(awsLayer);
            if (station.properties.WG) {
                let windHighlightClass = '';
                if (station.properties.WG > 2) {
                    windClass = "wind-2";
                }
                if (station.properties.WG > 4) {
                    windHighlightClass = "wind-4";
                }
                if (station.properties.WG > 6) {
                    windHighlightClass = "wind-6";
                }
                if (station.properties.WG > 8) {
                    windHighlightClass = "wind-8";
                }
                if (station.properties.WG > 10) {
                    windHighlightClass = "wind-10";
                }
                if (station.properties.WG > 12) {
                    windHighlightClass = "wind-12";
                }
                if (station.properties.WG > 20) {
                    windHighlightClass = "wind-20";
                }
                if (station.properties.WG > 30) {
                    windHighlightClass = "wind-30";
                }
                
                if (station.properties.WG > 40) {
                    windHighlightClass = "wind-40";
                }
            
                if (station.properties.WG > 50) {
                    windHighlightClass = "wind-50";
                }

                let windIcon = L.divIcon({
                    //https://leafletjs.com/reference-1.7.1.html#divicon
                    html: `<div class="wind-label ${windHighlightClass}">${station.properties.WG}</div>`
                })
                let windMarker = L.marker([
                    //https://leafletjs.com/reference-1.7.1.html#marker
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: windIcon
                });
                windMarker.addTo(windLayer);
            }



            marker.addTo(awsLayer);
            if (station.properties.HS) {
                let highlightClass = '';
                if (station.properties.HS > 100) {
                    highlightClass = 'snow-100';
                }
                if (station.properties.HS > 200) {
                    highlightClass = 'snow-200';
                }
                let snowIcon = L.divIcon({
                    html: `<div class="snow-label ${highlightClass}">${station.properties.HS}</div>`
                })
                let snowMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: snowIcon
                });
                snowMarker.addTo(snowLayer);
            }


            marker.addTo(awsLayer);
            if (station.properties.LT) {
                let temphighlightClass = '';
                if (station.properties.LT > 0) {
                    temphighlightClass = 'temp-positive';
                }
                if (station.properties.LT < 0) {
                    temphighlightClass = 'temp-negative';
                }
                if (station.properties.LT == 0) {
                    temphighlightClass = 'temp-zero';
                }
                let tempIcon = L.divIcon({
                    html: `<div class="temp-label ${temphighlightClass}">${station.properties.LT}</div>`
                })
                let tempMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: tempIcon
                });
                tempMarker.addTo(tempLayer);
            }
        }
        // set map view to all stations
        map.fitBounds(awsLayer.getBounds());
    });

    
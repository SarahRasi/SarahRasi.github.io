// OGD-Wien Beispiel

// Kartenhintergründe der basemap.at definieren
let baselayers = {
    standard: L.tileLayer.provider("BasemapAT.basemap"),
    grau: L.tileLayer.provider("BasemapAT.grau"),
    terrain: L.tileLayer.provider("BasemapAT.terrain"),
    surface: L.tileLayer.provider("BasemapAT.surface"),
    highdpi: L.tileLayer.provider("BasemapAT.highdpi"),
    ortho_overlay: L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ]),
};

// Overlays für die Themen zum Ein- und Ausschalten definieren
let overlays = {
    busLines: L.featureGroup(),
    busStops: L.featureGroup(),
    pedAreas: L.featureGroup(),
    sights: L.featureGroup()
};

// Karte initialisieren und auf Wiens Wikipedia Koordinate blicken
let map = L.map("map", {
    center: [48.208333, 16.373056],
    zoom: 13,
    layers: [
        baselayers.grau
    ]
});

// Kartenhintergründe und Overlays zur Layer-Control hinzufügen
let layerControl = L.control.layers({
    "basemap.at Standard": baselayers.standard,
    "basemap.at grau": baselayers.grau,
    "basemap.at Relief": baselayers.terrain,
    "basemap.at Oberfläche": baselayers.surface,
    "basemap.at hochauflösend": baselayers.highdpi,
    "basemap.at Orthofoto beschriftet": baselayers.ortho_overlay
}, {
    "Liniennetz Vienna Sightseeing": overlays.busLines,
    "Haltestellen Vienna Sightseeing": overlays.busStops,
    "Fußgängerzonen": overlays.pedAreas,
    "Sehenswürdikeiten": overlays.sights
}).addTo(map);

// alle Overlays nach dem Laden anzeigen
overlays.busLines.addTo(map);
overlays.busStops.addTo(map);
overlays.pedAreas.addTo(map);
overlays.sights.addTo(map);


let drawBusStop = (geojsonData) => {
    L.geoJson(geojsonData, {
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<strong>${feature.properties.LINE_NAME}</strong>
            <hr>
            Station: ${feature.properties.STAT_NAME}`)
        },
        pointToLayer: (geoJsonPoint, latlng) => {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: 'icons/busstop.png',
                    iconSize: [38, 38]
                })
            })
        },
        attribution: '<a href="https://data.wien.gv.at">Stadt Wien<a/>, <a href="https://mapicons.mapsmarker.com">Maps Icon Collection<a/>'
    }).addTo(overlays.busStops);
}


let drawBusLine = (geojsonData) => {
    L.geoJson(geojsonData, {
        style: (feature) => {
            let col = COLORS.buslines[feature.properties.LINE_NAME];
            return {
                color: col
            }
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<strong>${feature.properties.LINE_NAME}</strong>
            <hr>
            von ${feature.properties.FROM_NAME}<br>
            nach ${feature.properties.TO_NAME}`)
        },
        attribution: '<a href="https://data.wien.gv.at">Stadt Wien<a/>, <a href="https://mapicons.mapsmarker.com">Maps Icon Collection<a/>'
    }).addTo(overlays.busLines);
}

let drawPedestrianAreas = (geojsonData) => {
    L.geoJson(geojsonData, {
        style: (feature) => {
            return {
                stroke: true,
                color: "silver",
                fillColor:"yellow",
                fillOpacity: 0.3
            }
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<strong>Fußgängerzone ${feature.properties.ADRESSE}</strong>
            <hr>
            ${feature.properties.ZEITRAUM || ""} <br>
            ${feature.properties.AUSN_TEXT || ""}
            `);
        }
    }).addTo(overlays.pedAreas);
}


let drawSights = (geojsonData) => {
    console.log('Sights: ',geojsonData);
    L.geoJson(geojsonData, {
        onEachFeature: (feature, layer) => {
            //layer.bindPopup(`<strong>${feature.properties.LINE_NAME}</strong>
            //<hr>
            //Station: ${feature.properties.STAT_NAME}`)
        },
        pointToLayer: (geoJsonPoint, latlng) => {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: 'icons/sehenswuerdigogd.png',
                    iconSize: [38, 38]
                })
            })
        },
        attribution: '<a href="https://data.wien.gv.at">Stadt Wien<a/>'
    }).addTo(overlays.sights);
}


for (let config of OGDWIEN) {
    console.log("Config: ", config.data);
    fetch(config.data)
        .then(response => response.json())
        .then(geojsonData => {
            console.log("Data: ", geojsonData);
            if(config.title == "Haltestellen Vienna Sightseeing") {
                drawBusStop(geojsonData);
            }
            else if(config.title == "Liniennetz Vienna Sightseeing") {
                drawBusLine(geojsonData);
            }
            else if(config.title == "Fußgängerzonen") {
                drawPedestrianAreas(geojsonData);
            }
            else if(config.title == "Sehenswürdigkeiten") {
                drawSights(geojsonData);
            }
        })
}


//aus data gv weiteren Dazuesatz dazu mit Sehenswürdigkeiten in Wien (bei data.gv.at in Suche Sehenswürdigkeiten Standorte Wien)
//runterladen, Programm so erweitern, dass wir das dazu schalten können mit Icon und hinzu und weg schalten (Punkt Layer)
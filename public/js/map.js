console.log("Token:", mapToken);
console.log("Coords:", coords);

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coords,
    zoom: 10
});

new mapboxgl.Marker({ color: "red" })
    .setLngLat(coords)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${listingTitle}</h3><p>${listingLocation}</p>`)
    )
    .addTo(map);

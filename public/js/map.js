mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 8 // starting zoom
});

console.log(listing.geometry.coordinates);
 const marker1 = new mapboxgl.Marker({color:"#fe424d"})
.setLngLat(listing.geometry.coordinates)
.setPopup( new mapboxgl.Popup({offset: 25, className: 'my-class'}).setHTML(`<h4>${listing.title}</h4><p>Exact Location will be Provided after booking</P`))
.addTo(map);
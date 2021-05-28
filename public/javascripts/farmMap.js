
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: farm.geometry.coordinates, // starting position [lng, lat]
    zoom: 7 // starting zoom
  });

  
new mapboxgl.Marker({"color": "#0B5ED7"})
.setLngLat(farm.geometry.coordinates)
/*.setPopup(
    new mapboxgl.Popup({ offset:25 })
    .setHTML(
        `<p style="font-size:16px; color:#202020">${farm.location}</p>`
    )
)*/
.addTo(map)

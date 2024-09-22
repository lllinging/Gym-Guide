mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',// container id
    style: 'mapbox://styles/mapbox/streets-v11',// style of the map
    center: gym.geometry.coordinates,// starting position
    zoom: 9// starting zoom
});


new mapboxgl.Marker()
    .setLngLat(gym.geometry.coordinates)
    //setpopup is a method that will allow us to create a popup that will appear when we click on the marker
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${gym.title}</h3><p>${gym.location}</p>`
            )
    )
    //add the marker to the map
    //map is a mapboxgl map object that we created above with the new mapboxgl.Map() constructor function 
    .addTo(map)


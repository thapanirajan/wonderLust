
mapboxgl.accessToken = mapToken;
console.log(mapToken)
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.coordinates.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});
const marker1 = new mapboxgl.Marker()
    .setLngLat(listing.coordinates.coordinates)
    .addTo(map);

document.getElementById("del").addEventListener("click", (event) => {
    event.preventDefault();
    Swal.fire({
        title: " Are you sure ? ",
        text: "This action cannot be undone",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes , delete it",
        cancelButtonText: "Cancel",
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById("delForm").submit();
        }
    });
});
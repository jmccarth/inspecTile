function updateCenterInputs(map){
    var lat = map.getCenter().lat;
    var lng = map.getCenter().lng;

    document.getElementById('center_lat').value = lat;
    document.getElementById('center_long').value = lng;

}

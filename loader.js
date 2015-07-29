var left_map;
var right_map;

function initMaps(){
    var lat = document.getElementById('center_lat').value;
    var long = document.getElementById('center_long').value;

    left_map = L.map('left-map').setView([lat, long], 13);
    right_map = L.map('right-map').setView([lat, long], 13);

    left_map.on('moveend',function(e){
      right_map.setView(e.target.getCenter(),e.target.getZoom());
    });

    right_map.on('moveend',function(e){
      left_map.setView(e.target.getCenter(),e.target.getZoom());
    });
}

function loadLeftTiles(){
  var tile_url = document.getElementById('left-map-url').value;
  loadTiles(left_map,tile_url);
}

function loadRightTiles(){
  var tile_url = document.getElementById('right-map-url').value;
  loadTiles(right_map,tile_url);
}

function loadTiles(map,tile_URL){
  var lat = document.getElementById('center_lat').value;
  var long = document.getElementById('center_long').value;
  L.tileLayer(tile_URL).addTo(map);
  map.setView([lat,long]);
}

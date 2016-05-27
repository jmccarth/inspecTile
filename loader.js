var left_map;
var right_map;

function initMaps(){
    var lat = document.getElementById('center_lat').value;
    var long = document.getElementById('center_long').value;

    left_map = L.map('left-map').setView([lat, long], 13);
    right_map = L.map('right-map').setView([lat, long], 13);

    left_map.on('moveend',function(e){
      right_map.setView(e.target.getCenter(),e.target.getZoom());
      updateCenterInputs(e.target);
    });

    right_map.on('moveend',function(e){
      left_map.setView(e.target.getCenter(),e.target.getZoom());
      updateCenterInputs(e.target);
    });

    loadTilesFromURL();
    // updateURLInputs();
}

function loadLeftTiles(){
  var tile_url = document.getElementById('left-map-url').value;
  loadTiles(left_map,tile_url);
  addTilesToURL(0,tile_url);
}

function loadRightTiles(){
  var tile_url = document.getElementById('right-map-url').value;
  loadTiles(right_map,tile_url);
  addTilesToURL(1,tile_url);
}

function loadTiles(map,tile_URL){
  var lat = document.getElementById('center_lat').value;
  var long = document.getElementById('center_long').value;
  L.tileLayer(tile_URL).addTo(map);
  map.setView([lat,long]);
}

/**
  loadTilesFromURL
*/
function loadTilesFromURL(){
  var url = URI(window.location.href);
  var left_url = url.query(true).leftmap;
  var right_url = url.query(true).rightmap;



  if (left_url != undefined) {
    // remove trailing slash from URLs if they exist
    if (left_url.substr(-1) === '/'){
      var left_url = left_url.substr(0,left_url.length -1);
    }
    loadTiles(left_map,left_url);
    updateLeftURLInput(left_url);
  }
  if (right_url != undefined) {
    // remove trailing slash from URLs if they exist
    if (right_url.substr(-1) === '/'){
      var right_url = right_url.substr(0,right_url.length -1);
    }
    loadTiles(right_map,right_url);
    updateRightURLInput(right_url);
  }


}

function updateCenterInputs(map){
    var lat = map.getCenter().lat;
    var lng = map.getCenter().lng;

    document.getElementById('center_lat').value = lat;
    document.getElementById('center_long').value = lng;
}

function updateLeftURLInput(tile_url){
  document.getElementById('left-map-url').value = tile_url;
}

function updateRightURLInput(tile_url){
  document.getElementById('right-map-url').value = tile_url;
}



/**
  addTilesToURL
  - map_index - 0 is left map, 1 is right map
  - tileURL - URL of the tileset being added
*/
function addTilesToURL(map_index,tileURL){
  var url = URI(window.location.href);

  if (map_index == 0){
    url.removeSearch("leftmap");
    url.addSearch("leftmap",tileURL);
    window.history.replaceState(null,null,url.href());
  }
  else if (map_index == 1){
    url.removeSearch("rightmap");
    url.addSearch("rightmap",tileURL);
    window.history.replaceState(null,null,url.href());
  }
}

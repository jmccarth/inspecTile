var last_highlighted_id;

function handleFileUpload(){
  var file = this.files[0];
  console.log(file);

  var reader = new FileReader();
  reader.onload = function(e){
    var text = reader.result;
    parseDiffFileContents(text);
  }

  reader.readAsText(file);
}

function parseDiffFileContents(file_contents){
  var diffs = file_contents.split('\n');
  var diff_list_html = document.getElementById('unmatched_tiles');
  for (diff in diffs){
    // tile_id has the format 14/4539/5992.png
    // or more generally: z/x/y.png
    var tile_id = diffs[diff].split(":")[1];
    var new_li = document.createElement("li");
    new_li.appendChild(document.createTextNode(tile_id));
    diff_list_html.appendChild(new_li);
    new_li.addEventListener('click',zoomToTileFromID.bind(null,tile_id));
    var new_flag = document.createElement("input");
    new_flag.type = 'checkbox';
    new_flag.id = 'chk_' + tile_id;
    new_flag.addEventListener('click',flagCheckboxToggled.bind(new_flag,tile_id));
    new_li.appendChild(new_flag);


  }
  document.getElementById("num_diff_tiles").textContent = diffs.length
}

function flagCheckboxToggled(tile_id){
  event.stopPropagation();
  if(this.checked){
    flagTile(tile_id);
  }
  else{
    unflagTile(tile_id);
  }
}

function flagTile(tile_id){
  var flag_list_html = document.getElementById('flagged_tiles');
  var num_flagged = document.getElementById('num_flagged_tiles').textContent;
  var new_li = document.createElement("li");
  new_li.id = 'flag_' + tile_id;
  new_li.appendChild(document.createTextNode(tile_id));
  new_li.addEventListener('click',unflagTile.bind(new_li, tile_id));
  flag_list_html.appendChild(new_li);
  document.getElementById('num_flagged_tiles').textContent = parseInt(num_flagged) + 1;

  var diff_checkbox = document.getElementById('chk_' + tile_id);
  diff_checkbox.checked = true;
}

function unflagTile(tile_id){
  var flag_list_html = document.getElementById('flagged_tiles');
  var num_flagged = document.getElementById('num_flagged_tiles').textContent;
  var li = document.getElementById('flag_' + tile_id);
  flag_list_html.removeChild(li);
  document.getElementById('num_flagged_tiles').textContent = parseInt(num_flagged) - 1;

  var diff_checkbox = document.getElementById('chk_' + tile_id);
  diff_checkbox.checked = false;
}

function zoomToTileFromID(tile_id){
  var zoom = tile_id.split("/")[0];
  var x = tile_id.split("/")[1];
  var y = tile_id.split("/")[2].split(".png")[0];
  var lon = tile2long(x,zoom);
  var lat = tile2lat(y,zoom);
  var centre = L.latLng(lat,lon);
  left_map.setView(centre,zoom);
  right_map.setView(centre,zoom);
  highlightTiles(tile_id);
}

function highlightTiles(tile_id){

  var matching_tiles = []
  var tiles = document.getElementsByTagName('img');
  for (tile in tiles){
    if (tiles[tile].src != undefined){
      if (tiles[tile].src.includes(tile_id)){
        matching_tiles.push(tiles[tile]);
      }
      else if (tiles[tile].src.includes(last_highlighted_id)){
        tiles[tile].style.zIndex = "";
        tiles[tile].style.boxShadow = "";
      }
    }
  }

  for (tile in matching_tiles){
    matching_tiles[tile].style.zIndex = "5000";
    matching_tiles[tile].style.boxShadow = "0 0 10px black"
  }

  last_highlighted_id = tile_id;
}

// copied from http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#X_and_Y
function tile2long(x,z) {
  return (x/Math.pow(2,z)*360-180);
 }

function tile2lat(y,z) {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
 }

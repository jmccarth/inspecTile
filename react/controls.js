var InspecTileContainer = React.createClass({
  getInitialState: function(){
    return {
      left_map_id: "left-map",
      right_map_id: "right-map",
      left_map_url: "",
      right_map_url: "",
      selected_tile_id: ""
    };
  },
  handleTileURLChange: function(map_id,newTileURL){
    if (this.state.left_map_id == map_id){
      this.setState({left_map_url: newTileURL})
    }
    else if (this.state.right_map_id == map_id){
      this.setState({right_map_url: newTileURL});
    }
  },
  handleTileSelection: function(tile_id){
    this.setState({
      selected_tile_id: tile_id.split(":")[1]
    });
  },
  render: function(){
    return (
      <div>
        <MapsContainer
          left_map_id={this.state.left_map_id}
          right_map_id={this.state.right_map_id}
          left_tile_url={this.state.left_map_url}
          right_tile_url={this.state.right_map_url}
          selected_tile_id={this.state.selected_tile_id}
        />
        <MapControlsContainer onTileURLChange={this.handleTileURLChange}  />
        <TileCompareContainer onTileSelection={this.handleTileSelection} />
      </div>
    );
  }
});

var TileCompareContainer = React.createClass({
  getInitialState: function(){
    return {
      diffs: []
    };
  },
  handleFileUpload: function(e){
    var file = e.target.files[0];
    var reader = new FileReader();
    // More info on arrow functions:
    // https://www.sitepoint.com/es6-arrow-functions-new-fat-concise-syntax-javascript/
    reader.onloadend = () => {
      var text = reader.result;
      this.parseDiffFileContents(text);
    }
    reader.readAsText(file);
  },
  parseDiffFileContents: function(text){
    this.setState({
      diffs: text.split('\n')
    });
  },
  render: function(){
    return(
      <div>
        <input type="file" onChange={this.handleFileUpload} />
        <TileCompareResultsContainer results={this.state.diffs} onTileSelection={this.props.onTileSelection} />
      </div>
    );
  }
});

var TileCompareResultsContainer = React.createClass({
  render: function(){
    return(
      <div>

      {this.props.results.map((diff) =>
          {
            return <UnmatchedTileResult tile_id={diff} onTileSelection={this.props.onTileSelection} />
          }
      )}
      </div>
    );
  }
});

var UnmatchedTileResult = React.createClass({
  handleResultClick: function() {
    var tile_id = this.props.tile_id;
    // this.zoomToTile(tile_id);
    // this.highlightTile(tile_id);
    this.props.onTileSelection(tile_id);
  },
  render: function(){
    return(
      <li onClick={this.handleResultClick}>{this.props.tile_id}</li>
    )
  }
});

var MapsContainer = React.createClass({
  getInitialState: function(){
    return{
      l_lat: 43.5,
      l_lng: -80.5,
      l_zoom: 11,
      r_lat: 43.5,
      r_lng: -80.5,
      r_zoom: 11,
    }
  },
  updateMapStates:function(lat, lng, zoom){
    this.setState({
      l_lat: lat,
      l_lng: lng,
      l_zoom: zoom,
      r_lat: lat,
      r_lng: lng,
      r_zoom: zoom
    });
  },
  render: function(){
      return (
        <div className='maps-container'>
          <MapElement
            id={this.props.left_map_id}
            tile_url={this.props.left_tile_url}
            lat={this.state.l_lat}
            lng={this.state.l_lng}
            zoom={this.state.l_zoom}
            selected_tile={this.props.selected_tile_id}
            onViewChange={this.updateMapStates}
          />
          <MapElement
            id={this.props.right_map_id}
            tile_url={this.props.right_tile_url}
            lat={this.state.r_lat}
            lng={this.state.r_lng}
            zoom={this.state.r_zoom}
            selected_tile={this.props.selected_tile_id}
            onViewChange={this.updateMapStates}
          />
        </div>
      );
  }
});



var MapElement = React.createClass({
  getInitialState: function(){
    return {
      tile_url: '',
      tile_layer: null,
      map: null
    };
  },
  componentDidMount: function(){
    this.init(this.getID());
  },
  init: function(id){
    var new_map = L.map(id).setView([this.props.lat, this.props.lng],this.props.zoom);

    new_map.on('moveend',this.updateToOtherMaps);

    this.setState({
      map: new_map
    });
  },
  getID: function(){
    return this.props.id;
  },
  updateTileURL: function(new_tile_url){
    var new_tile_layer = L.tileLayer(new_tile_url);
    this.setState({
      tile_url: new_tile_url,
      tile_layer: new_tile_layer
    });
    new_tile_layer.addTo(this.state.map);
  },
  componentDidUpdate: function(){
    this.state.map.setView([this.props.lat, this.props.lng], this.props.zoom);
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.selected_tile != ''){
      this.selectTile(nextProps.selected_tile);
    }
    //check if new props have a new tile URL and update if it does
    if(nextProps.tile_url != "" && nextProps.tile_url != this.props.tile_url){
      this.updateTileURL(nextProps.tile_url);
    }
  },
  updateToOtherMaps: function(e){
    this.props.onViewChange(this.state.map.getCenter().lat,this.state.map.getCenter().lng,this.state.map.getZoom());
  },
  selectTile: function(tile_id){
      //zoom to tile
      var zoom = tile_id.split("/")[0];
      var x = tile_id.split("/")[1];
      var y = tile_id.split("/")[2].split(".png")[0];
      var lon = tile2long(x,zoom);
      var lat = tile2lat(y,zoom);
      var centre = L.latLng(lat,lon);
      this.state.map.setView(centre, zoom);

      //select tile
      var matching_tiles = [];
      var tiles = document.getElementsByTagName('img');
      for (var tile in tiles){
        if (tiles[tile].src != undefined){
          // console.log(tiles);
          // console.log(tile_id);
          if (tiles[tile].src.includes(tile_id)){
            matching_tiles.push(tiles[tile]);
          }

        }
      }
      // console.log(matching_tiles);
      for (tile in matching_tiles){
        matching_tiles[tile].style.zIndex = "5000";
        matching_tiles[tile].style.boxShadow = "0 0 10px black"
      }

      // last_highlighted_id = tile_id;
  },
  render: function(){
    return(
      <div id={this.props.id} className='map-container'>
      </div>
    );
  }
});

var MapControlsContainer = React.createClass({
  handleLeftTileURLChange: function(newTileURL){
    this.props.onTileURLChange('left-map', newTileURL.tileURL);
  },
  handleRightTileURLChange: function(newTileURL){
    this.props.onTileURLChange('right-map', newTileURL.tileURL);
  },
  render: function(){
    return (
      <div>
       Left Tile URL: <TileURLInput target_map='left-map' onTileURLChange={this.handleLeftTileURLChange} />
       Right Tile URL: <TileURLInput target_map='right-map' onTileURLChange={this.handleRightTileURLChange} />
      </div>
    );
  }
})

var TileURLInput = React.createClass({
  getInitialState: function(){
    return {value: ''};
  },
  handleChange: function(event){
    this.setState({value: event.target.value});
  },
  handleClick: function(event){
    this.props.onTileURLChange({tileURL: this.state.value});
  },
  render: function(){
    return(
      <div>
        <input
          type="text"
          placeholder="Tile URL"
          onChange={this.handleChange}
        />
        <input
          type="button"
          onClick={this.handleClick}
          value="Load Tiles"
        />
      </div>
    );
  }
})

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

// copied from http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#X_and_Y
function tile2long(x,z) {
  return (x/Math.pow(2,z)*360-180);
 }

function tile2lat(y,z) {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
 }

ReactDOM.render(
  <InspecTileContainer />,
  document.getElementById('container')
);

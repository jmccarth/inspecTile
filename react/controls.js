var InspecTileContainer = React.createClass({
  getInitialState: function(){
    return {
      left_map_id: "left-map",
      right_map_id: "right-map",
      left_map_url: "",
      right_map_url: ""
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
  render: function(){
    return (
      <div>
        <MapsContainer
          left_map_id={this.state.left_map_id}
          right_map_id={this.state.right_map_id}
          left_tile_url={this.state.left_map_url}
          right_tile_url={this.state.right_map_url}
        />
        <MapControlsContainer onTileURLChange={this.handleTileURLChange} />
      </div>
    );
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
      r_zoom: 11
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
            onViewChange={this.updateMapStates}
          />
          <MapElement
            id={this.props.right_map_id}
            tile_url={this.props.right_tile_url}
            lat={this.state.r_lat}
            lng={this.state.r_lng}
            zoom={this.state.r_zoom}
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
    //check if new props have a new tile URL and update if it does
    if(nextProps.tile_url != "" && nextProps.tile_url != this.props.tile_url){
      this.updateTileURL(nextProps.tile_url);
    }
  },
  updateToOtherMaps: function(e){
    this.props.onViewChange(this.state.map.getCenter().lat,this.state.map.getCenter().lng,this.state.map.getZoom());
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
       <TileURLInput target_map='left-map' onTileURLChange={this.handleLeftTileURLChange} />
       <TileURLInput target_map='right-map' onTileURLChange={this.handleRightTileURLChange} />
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

ReactDOM.render(
  <InspecTileContainer />,
  document.getElementById('container')
);

var map;
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
  render: function(){
      return (
        <div className='maps-container'>
          <MapElement id={this.props.left_map_id} tile_url={this.props.left_tile_url} />
          <MapElement id={this.props.right_map_id} tile_url={this.props.right_tile_url} />
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
  updateTileURL: function(new_tile_url){
    var new_tile_layer = L.tileLayer(new_tile_url);
    this.setState({
      tile_url: new_tile_url,
      tile_layer: new_tile_layer
    });
    new_tile_layer.addTo(this.state.map);
  },
  componentDidMount: function(){
    this.init(this.getID());
  },
  componentWillReceiveProps: function(nextProps){
    //check if new props have a new tile URL and update if it does
    if(nextProps.tile_url != "" && nextProps.tile_url != this.props.tile_url){
      this.updateTileURL(nextProps.tile_url);
    }
  },
  getID: function(){
    return this.props.id;
  },
  init: function(id){
    this.setState({
      map: L.map(id).setView([43.5,-80.5],11)
    });
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

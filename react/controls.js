var map;
var InspecTileContainer = React.createClass({
  render: function(){
    return (
      <div>
        <MapsContainer />
      </div>
    );
  }
});

var MapsContainer = React.createClass({
  render: function(){
      return (
        <div>
          <MapContainer id='left-map' />
          <MapContainer id='right-map' />
        </div>
      );
  }
});

var MapContainer = React.createClass({
  componentDidMount: function(){
    this.init(this.getID());
  },
  getID: function(){
    return this.props.id;
  },
  init: function(id){
    map = L.map(id);
  },
  render: function(){
    return(
      <div id={this.props.id} className='map-container'>
      </div>
    );
  }
});

ReactDOM.render(
  <InspecTileContainer />,
  document.getElementById('container')
);

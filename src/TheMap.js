import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class TheMap extends Component {

  componentDidMount() {
    this.loadMap();
  }

  loadMap() {
    if (this.props && this.props.google) {
      // Google API is available
      const {google} = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let zoom = 13;
      let lat = 31.200100;
      let lng = 29.918700;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new maps.Map(node, mapConfig);
    }
  }

  render() {

    return (
      <div ref='map' className="the-map">
        Loading map...
      </div>
    );
  }
}

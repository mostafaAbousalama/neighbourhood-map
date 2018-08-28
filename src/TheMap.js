import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class TheMap extends Component {

  state = {
    query: "",
    locations: [],
    markers: [],
    infowindow: new this.props.google.maps.InfoWindow(),
    selectedIcon: null,
    fsError: "",
    mapError: ""
  }

  componentDidMount() {

    fetch('https://api.foursquare.com/v2/venues/search?client_id=5NDJGWHYZ4AGS4PMS4532RXMHJRB322SBFJCKM5KYGAIYCUI&client_secret=FZMDM5LEDXCDTG1AX2KB35GE3CZ2NMOKWD304Y125QGQORMI&v=20180323&limit=7&ll=31.200100,29.918700&categoryId=4d4b7104d754a06370d81259')
      .then( res => res.json() )
      .then( data => {
        this.setState({locations: data.response.venues})
        this.loadMap();
      })
      .catch( err => { this.setState({fsError: err.toString()}) })

    this.setState({selectedIcon: this.makeMarkerIcon('13af1b')})
  }

  loadMap() {
    if (this.props && this.props.google) {
      // Google API is available
      const {google} = this.props;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let zoom = 13;
      let lat = 31.200100;
      let lng = 29.918700;
      const center = new google.maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new google.maps.Map(node, mapConfig);

      this.createMarkersOnMap()
    } else {
      this.setState({mapError: "Error during loading the Google map, Please refresh the page"})
    }
  }

  createMarkersOnMap = () => {
    const {google} = this.props
    let {infowindow, locations} = this.state
    const bounds = new google.maps.LatLngBounds();

    locations.forEach((l, ind) => {
      let marker = new google.maps.Marker({
        position: {lat: l.location.lat, lng: l.location.lng},
        map: this.map,
        title: l.name
      })

      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow, locations[ind])
      })
      this.setState( state => ({
        markers: [...state.markers, marker]
      }))

      bounds.extend(marker.position)
      })


    this.map.fitBounds(bounds)
  }


    populateInfoWindow = (marker, infowindow, location) => {

      const {markers, selectedIcon} = this.state
      const {google} = this.props

      const defaultIcon = marker.getIcon()

      if (infowindow.marker !== marker) {
        if (infowindow.marker) {
          const index = markers.findIndex(m => m.title === infowindow.marker.title)
          markers[index].setIcon(defaultIcon)
        }
        marker.setIcon(selectedIcon)
        infowindow.marker = marker;

        infowindow.setContent(
          `<h3>${location.name}</h3>
          <h4>${location.categories[0].name}</h4>
          <h4>Address: ${location.location.formattedAddress.join(", ")}</h4>`
        );

        infowindow.open(this.map, marker);

        infowindow.addListener('closeclick', () => {
          infowindow.marker = null
          marker.setIcon(defaultIcon)
        });

      }
    }

  makeMarkerIcon = (markerColor) => {
    const {google} = this.props
    let markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

  render() {

    return (
      <main className="main-container">
        <aside className="side-bar">

        </aside>
        <div className="map-container">
          <div ref='map' className="the-map">
            Loading map...
          </div>
        </div>
      </main>
    );
  }
}

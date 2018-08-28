import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class TheMap extends Component {

  state = {
    query: "",  // To make the search input a controlled element
    locations: [], // To store the venues retrieved from Foursquare API
    markers: [],
    infowindow: new this.props.google.maps.InfoWindow(),  //  Create a new instance of the InfoWindow
    selectedIcon: null,
    defaultIcon: null,
    fsError: "",  // Any error that arises during fetching of resources from Foursquare API
    mapError: ""  //  Any error that arises during loading the map
  }

  componentDidMount() {
    //  Fetching the locations by searching the Foursquare API with these options:
    //  limit search results to 10
    //  latlng of Alexandria, Egypt center coordinates
    //  search for venus in the Arts & Entertainment category id
    fetch('https://api.foursquare.com/v2/venues/search?client_id=5NDJGWHYZ4AGS4PMS4532RXMHJRB322SBFJCKM5KYGAIYCUI&client_secret=FZMDM5LEDXCDTG1AX2KB35GE3CZ2NMOKWD304Y125QGQORMI&v=20180323&limit=10&ll=31.200100,29.918700&categoryId=4d4b7104d754a06370d81259')
      .then( res => res.json() )
      .then( data => {
        this.setState({locations: data.response.venues})
        this.loadMap(); //load the map after component mounts and data retrieved from Foursquare API
      })
      .catch( err => { this.setState({fsError: err.toString()}) })

    //  Create a special looking icon and set it to the state.
    this.setState({selectedIcon: this.makeMarkerIcon('13af1b')})
  }

  loadMap() {
    if (this.props && this.props.google) {
      // Google API is loaded
      const {google} = this.props;

      //  Catch the <div> with ref="map" to load the map in it
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

      //  After the map loads, draw all the markers of all locations on the map by default
      this.createMarkersOnMap()
    } else {
      //  If the Google API did not load, explain to the user.
      this.setState({mapError: "Error during loading the Google map, Please refresh the page"})
    }
  }

  createMarkersOnMap = () => {
    const {google} = this.props
    let {infowindow, locations} = this.state
    const bounds = new google.maps.LatLngBounds();

    //  Create a new marker instance for each location, using its data retrieved from the Foursquare API
    locations.forEach((l, ind) => {
      let marker = new google.maps.Marker({
        position: {lat: l.location.lat, lng: l.location.lng},
        map: this.map,
        title: l.name
      })

      // Add a listener to open infowindows holding information related to the location and marker
      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infowindow, locations[ind])
      })

      //  Add the newly created marker to the array of markers in the state
      this.setState( state => ({
        markers: [...state.markers, marker]
      }))

      bounds.extend(marker.position)
    })

    //  Save the default icon in the state for future use.
    let defaultIcon = this.state.markers[0].getIcon();
    this.setState({defaultIcon})

    //  Fit the bound of the map to view all markers
    this.map.fitBounds(bounds)
  }

    populateInfoWindow = (marker, infowindow, location) => {

      const {markers, selectedIcon, defaultIcon} = this.state

      //  Check that it is a different marker that is clicked other than the one that could be possibly open
      if (infowindow.marker !== marker) {
        //  if the there is an infowindow open, find its marker and set it to the default icon
        if (infowindow.marker) {
          const index = markers.findIndex(mrkr => mrkr.title === infowindow.marker.title)
          markers[index].setIcon(defaultIcon)
        }
        //  Set the clicked marker to the special looking icon and bind the InfoWindow to it
        marker.setIcon(selectedIcon)
        infowindow.marker = marker;

        //  Set the content of the InfoWindow using the location data retrieved from the Foursquare API
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

  //  Controlling the query state on every change in the search bar
  changeQueryState = (event) => {
    this.setState({query: event.target.value})
  }

  //  if a location link is clicked, open its related infowindow on the map
  handleLocationLinkClick = (event) => {
    const {locations, markers, infowindow} = this.state

    //  loop through the markers array and identify the matching marker
    const index = markers.findIndex(m =>
      m.title.toLowerCase() === event.target.innerText.toLowerCase()
    )
    this.populateInfoWindow(markers[index], infowindow, locations[index])

  }

  //  Same as handleLocationLinkClick but check if the pressed key in enter
  handleLocationLinkKeyPress = (event) => {
    const {locations, markers, infowindow} = this.state
    if (event.keyCode === 13) {

      const index = markers.findIndex(m =>
        m.title.toLowerCase() === event.target.innerText.toLowerCase()
      )
      this.populateInfoWindow(markers[index], infowindow, locations[index])
    }
  }

  render() {

    const {query, locations, markers, infowindow, defaultIcon} = this.state

    //  if there is a written query, loop through the locations array
    if (query) {
      locations.forEach( (l,ind) => {
        //  if any location's name matches even partially with the query, set the visibilty of the corresponding marker to visible.
        if (l.name.toLowerCase().includes(query.toLowerCase())) {
          markers[ind].setVisible(true)
        } else {
          //  Check if an infowindow of one the mismatching markers was open, then close it
          if (infowindow.marker === markers[ind]) {
            infowindow.close()
          }
          //  If not, then set the corresponding marker's icon to default and its visibilty to false
          markers[ind].setIcon(defaultIcon)
          markers[ind].setVisible(false)
        }
      })
    } else {
      //  If there is no written query, set the visible property of all markers to true
      locations.forEach( (l, ind) => {
        if (markers[ind]) {
          markers[ind].setVisible(true);
        }
      })
    }

    return (
      <div>
      {
        this.state.fsError ? (
          <div className="error-msg">Oops, something wrong happened during fetching the data from the Foursquare API due to: {this.state.fsError}</div>
        ) : (
          <main className="main-container">
            <aside className="side-bar">
                <input role="search" type='text' value={this.state.query} onChange={this.changeQueryState} placeholder="Search Locations"/>
                <div>
                  <ul className="locations-list">{
                    //  loop through the markers and display on the locations list only those whose visible property is true.
                    markers.filter(m => m.getVisible()).map((m, i) =>
                      (<li role="link" onClick={this.handleLocationLinkClick} onKeyDown={this.handleLocationLinkKeyPress} key={i} tabIndex="0">{m.title}</li>))
                  }</ul>
                </div>
            </aside>
            <div className="map-container">
              {
                this.state.mapError ? (
                  <div className="error-msg">Oops, {this.state.mapError}</div>
                ) : (
                  <div ref='map' className="the-map" role="application">
                    Loading map...
                  </div> )
              }
            </div>
          </main>
        )
      }
      </div>
    );
  }
}

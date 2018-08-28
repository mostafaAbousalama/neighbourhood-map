import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import './App.css';
import TheMap from "./TheMap.js";

export class App extends Component {

  state = {
    placesFromFsAPI: [],
    FsAPIerrorMessage: ""
  };

  componentDidMount() {
    fetch('https://api.foursquare.com/v2/venues/search?client_id=5NDJGWHYZ4AGS4PMS4532RXMHJRB322SBFJCKM5KYGAIYCUI&client_secret=FZMDM5LEDXCDTG1AX2KB35GE3CZ2NMOKWD304Y125QGQORMI&v=20180323&limit=7&ll=31.200100,29.918700&categoryId=4d4b7104d754a06370d81259')
    .then( res => res.json() )
    .then( data => { this.setState( { placesFromFsAPI: data.response.venues } ) } )
    .catch( err => { this.setState( { FsAPIerrorMessage: err.toString() } ) } )
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Neighbourhood Map App using React, Google Maps API and Foursquare API</h1>
        </header>
        <TheMap google={this.props.google}/>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBkV78_IeXN3GcNOhEI264CQEWcM2VFw8A"
})(App)

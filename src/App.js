import React, { Component } from 'react';
import './App.css';

var foursquare = require('react-foursquare')({
  clientID: '5NDJGWHYZ4AGS4PMS4532RXMHJRB322SBFJCKM5KYGAIYCUI',
  clientSecret: 'FZMDM5LEDXCDTG1AX2KB35GE3CZ2NMOKWD304Y125QGQORMI'
});

var params = {
  "near": "Alexandria, Egypt",
  "categoryId": "4d4b7104d754a06370d81259"  //  Limit search matches to Arts & Entertainment venues
};

class App extends Component {

  state = {
    places: [],
    errorMessage: ""
  };

  componentDidMount() {
    foursquare.venues.getVenues(params)
      .then(res=> {
        this.setState({ places: res.response.venues });
      });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Neighbourhood Map App using React, Google Maps API and Foursquare API's React Library</h1>
        </header>
        {
          this.state.errorMessage ? (<div>{this.state.errorMessage}</div>) : (<div></div>)
        }
      </div>
    );
  }
}

export default App;

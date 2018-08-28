import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import './App.css';
import TheMap from "./TheMap.js";

export class App extends Component {

  toggleHiddenView = (event) => {
    document.querySelector('.side-bar').classList.toggle("side-bar-hide")
  }

  toggleHiddenViewKeyPress = (event) => {
    if (event.keyCode === 13) {
      document.querySelector('.side-bar').classList.toggle("side-bar-hide")
    }
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <div className="burger-menu" tabIndex="0" onClick={this.toggleHiddenView}
          onKeyDown={this.toggleHiddenViewKeyPress}>&#9776;</div>
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

# MyReads Project

## Introduction

This project is a single page application featuring a map of a neighbourhood. It displays markers of locations retrieved from a third party API, and upon clicking on one of those markers some information is displayed in an infowindow. There is also a list view of all those locations which include the same clicking functionality of the markers. There is a search bar that filters the list and the markers on the map in real time. Finally there is a hamburger menu item that hides the location lists and the search input for responsive design and small viewport devices.

## Installation

1. Clone the repository to your local machine.
2. Open your Git Bash interface in the cloned project directory.
3. run `node -v` and `npm -v` to ensure you have node.js and npm installed.
4. run `npm install` to install all project dependencies.
5. run `npm start` to start the server. This will automatically open a new tab in your default browser and load the main application page to it.

note: The service worker of this project is available only in production mode and not developer mode

##  Foursquare API
This project uses the Foursquare API to fetch information about venues.
https://developer.foursquare.com/docs

##  Create React App
This project was bootstrapped with Create React App.
https://github.com/facebook/create-react-app

##  google-maps-react
This project uses the google-maps-react made by fullstackreact
https://github.com/fullstackreact/google-maps-react

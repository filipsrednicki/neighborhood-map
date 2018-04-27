# Neighborhood Map Project (React)
## Overview
A single page application featuring a map of neighborhood. Functionality in this map includes highlighted locations, third-party data about those locations and various ways to browse the content.

## Instructions
Clone or download the files. In case of downloading - unpack the files. To launch the App you need to:

* install all project dependencies with `npm install`
* start the server with `npm start`

**Caching works only in production mode.**
To run a production build:
* execute command `npm run build`
* cd into `build` directory
* start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer.

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

* With your server running, open a browser and visit the site: `http://localhost:8000`.
## APIs / packages used

 - [Google Maps API](https://developers.google.com/maps/)
 - [Foursquare API](https://developer.foursquare.com/)
 - [react-async-script-loader](https://github.com/leozdgao/react-async-script-loader)
 - [react-foursquare](https://github.com/foursquare/react-foursquare)

### Create React App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

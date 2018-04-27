import React, { Component } from 'react'
import poweredByFoursquare from './img/Powered-by-Foursquare.png'
// Found this package: https://github.com/leozdgao/react-async-script-loader
// here: https://stackoverflow.com/a/41710341
import scriptLoader from 'react-async-script-loader'
import List from './List'

// I used this package: https://github.com/foursquare/react-foursquare
const foursquare = require('react-foursquare')({
  clientID: 'VS3L44BCDGQXF51EU1V0CL3Q2WTYFQVWPPDTC4ZN2BBDDFTO',
  clientSecret: 'B3AMXWW30BDTA0D2D3AVDZIWN5ER5P50DUMAN2XQBIPQT2TU'
});

class MapComponent extends Component {
  state = {
    map: null,
    locations: [
    {
      name: 'NVIDIA Corporation',
      position: {lat: 37.370535, lng: -121.966749}
    },
    {
      name: 'Intel Museum',
      position: {lat: 37.387524, lng: -121.963659}
    },
    {
      name: 'Googleplex',
      position: {lat: 37.422, lng: -122.084057}
    },
    {
      name: 'Facebook',
      position: {lat: 37.485071, lng: -122.147424}
    },
    {
      name: 'Udacity',
      position: {lat: 37.399913, lng: -122.108363}
    },
    {
      name: 'Apple Inc.',
      position: {lat: 37.331676, lng: -122.030189}
    }
  ],
  markers: [],
  venues: []
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.map = new window.google.maps.Map(this.refs.map, {
          center: {lat: 37.400535,lng: -122.018363},
          zoom: 11,
          mapTypeControl: false
        });

        const infoW = new window.google.maps.InfoWindow({width: '300px'})

        this.map.addListener('click', () => {
          infoW.close()
        })

        // Create marker for every location and object containing parameters for Foursquare request,
        // then request all the venues that match passed parameters
        this.state.locations.map((location) => {
          const marker = new window.google.maps.Marker({
            position: location.position,
            map: this.map,
            title: location.name
          });
          let params = {
            "query": location.name,
            "ll": location.position.lat + ',' + location.position.lng
          }
          foursquare.venues.getVenues(params)
          .then(res=> {
            let idParam = { // For each location save ID of the first venue only
              "venue_id": res.response.venues[0].id
            }
            // Pass the ID into another Foursquare request to get more detailed information
            foursquare.venues.getVenue(idParam) // for that specific venue
            .then(res=> {
              let venue = res.response.venue // Add listener to each marker to display on click and fill
              marker.addListener('click', function() { // out the InfoWindow with requested venue's data
                infoW.setContent(`<div class='info' tabIndex='0'>
                  <div class='name-address'>
                    <h2>${venue.name}</h2>
                    <p>${venue.location.formattedAddress.join(', ')}</p>
                    <div class='info-contact'>
                      ${venue.contact.twitter
                        ? `<a href=https://twitter.com/${venue.contact.twitter} class='entypo-twitter'> Twitter</a>`
                        : ''}
                      ${venue.contact.facebookUsername
                        ? `<a href=https://facebook.com/${venue.contact.facebookUsername} class='entypo-facebook-squared'> Facebook</a>`
                        : ''}
                      ${venue.url
                        ? `<a href=${venue.url} class='entypo-doc-text'> Visit ${venue.name} website</a>`
                        : ''}
                    </div>
                  </div>
                  <img class='info-img' src=https://igx.4sqi.net/img/general/width125${venue.bestPhoto.suffix} alt='${venue.name}'/>
                  <div class='link'>
                    <a href=${venue.shortUrl}>Read more on FourSquare</a>
                  </div>
                  <img class='powered-by' src=${poweredByFoursquare} alt='Powered by Foursquare logo'/>
                </div>`)
                infoW.open(this.map, marker)
                marker.setAnimation(window.google.maps.Animation.BOUNCE)
                setTimeout(() => {marker.setAnimation(null)}, 1450)
              })
              this.setState((state) => ({ // Place every marker into the array
                markers: state.markers.concat([marker])
              }))
            })
          }).catch(error => { // If FoursquareAPI request fails, display a message about it inside InfoWindow,
            marker.addListener('click', function() { // insted of info about a venue
              infoW.setContent(`<div class='error-msg'>
                <h2>Oops...</h2>
                <div>FoursquareAPI request failed</div>
              </div>`)
              infoW.open(this.map, marker)
              marker.setAnimation(window.google.maps.Animation.BOUNCE)
              setTimeout(() => {marker.setAnimation(null)}, 1450)
            })
          })
        })

      }
      else { // In case map doesn't load inform the user about it
        document.querySelector('#map').innerHTML = `<div class='error-msg'>
                                                      <h1>Failed to load the map :(</h1>
                                                      <p>Refresh to try again.</p>
                                                    </div>`
      }
    }
  }

  render(){
    return (
    <div>
      <List
        locations={this.state.locations}
        markers={this.state.markers}
        />
      <div ref="map"
           id='map'
           role="application"
           aria-label="Silicon Valley map">
      </div>
    </div>
    )
  }
}

export default scriptLoader(
    ["https://maps.googleapis.com/maps/api/js?key=AIzaSyCY-kz8UZFC8i1-FhMg4ZDVa2nRzaa0Z4E"]
)(MapComponent)

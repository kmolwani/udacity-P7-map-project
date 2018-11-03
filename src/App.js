import React, { Component } from 'react';

import { load_google_maps, load_fourSquare_API } from './map.js';
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: ''
    }
  }

  componentDidMount() {
    let googleMapPromise = load_google_maps();
    let fourSquarePlacesPromise = load_fourSquare_API();
    // creating promise to make sure to receive API objects
    Promise.all([
      googleMapPromise,
      fourSquarePlacesPromise,
    ])
    .then(values => {
      let google = values[0];
      let venues = values[1].response.venues;

      this.google = google;
      this.markers = [];
      this.infowindow = new google.maps.InfoWindow();
      this.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: { lat: venues[0].location.lat, lng: venues[0].location.lng }
      })

      venues.forEach(venue => {
        // eslint-disable-next-line
        let marker = new google.maps.Marker({
          position: { lat: venue.location.lat, lng: venue.location.lng },
          venues: venue,
          id: venue.id,
          name: venue.name,
          map: this.map,
          animation: google.maps.Animation.DROP,
        })
        this.markers.push(marker)

        marker.addListener('mouseover', () => {
          marker.setAnimation(google.maps.Animation.BOUNCE)
        })

        marker.addListener('mouseout', () => {
          marker.setAnimation(null)
        })

        let streetViewImage = 'https://maps.googleapis.com/maps/api/streetview?size=150x150&location=' + venue.location.lat + ',' + venue.location.lng + '&heading=151.78&pitch=-0.76&key=AIzaSyBLTp-LXOA-37eNiP6Bw9m-MzLu73D9O2o';
        var information = '<div className="infowindow">' +
        `<h2> ${venue.name} </h2>
        <p> ${venue.location.address}</p>
        <p> ${venue.location.formattedAddress[1]} </p>` +
        '<img className="image" alt="' + venue.name + '" src="' + streetViewImage + '"/>' +
        '</div>';

        google.maps.event.addListener(marker, 'click', () => {
          this.infowindow.setContent(information);
          this.infowindow.open(this.map, marker);
          this.map.setCenter(marker.position)
          this.map.setZoom(15)
        })
      })
    })
  }

  filterVenues(query) {
    this.markers.forEach( marker => {
        if (marker.name.toLowerCase().includes(query.toLowerCase()) == true) {
          marker.setVisible(true)
        } else {
          marker.setVisible(false)
        }
    })
    this.setState({ query })
  }

  render() {
    return (
      <div>
      <div className='sidebar'>
        <input value={this.state.query} placeholder='Search a Pizza location' onChange = {(e) => {this.filterVenues(e.target.value)}}/>
      </div>
      <div id="map" />

      </div>
    )
  }
}

export default App;

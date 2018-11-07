import React, { Component } from 'react';

import { load_google_maps, load_fourSquare_API, hideShowMenu } from './map.js';
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      venueList: {}
    }
    this.hideShowMenu = this.hideShowMenu.bind(this);
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

      this.venues = values[1].response.venues;
      this.google = google;
      this.markers = [];
      this.infowindow = new google.maps.InfoWindow();
      this.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: { lat: this.venues[15].location.lat, lng: this.venues[15].location.lng }
      })

      this.venues.forEach(venue => {
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
        var information = '<div id="infowindow">' +
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
    this.setState({ venueList: this.venues })
    })
    .catch( (error) => {
        alert('UH OH ... I am unable to load the page')
    })
  }

  hideShowMenu() {
    console.log('hi');
    var x = document.getElementById("sidebar");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  filterVenues(query) {
    let filteredVenues =  this.venues.filter(venue => venue.name.toLowerCase().includes(query.toLowerCase()));
    this.markers.forEach( marker => {
        if (marker.name.toLowerCase().includes(query.toLowerCase()) === true) {
          marker.setVisible(true)
        } else {
          marker.setVisible(false)
        }
    })
    this.setState({ venueList: filteredVenues, query })
  }

  venueInfo = (venue) => {
    let marker = this.markers.filter(m => m.id === venue.id)[0]
    var information = marker.name;

    this.infowindow.setContent(information);
    this.infowindow.open(this.map, marker);
    new Promise( (resolve) => {
          marker.setAnimation(this.google.maps.Animation.BOUNCE)
      })
      .then(
        setTimeout(() => {marker.setAnimation(null)}, 1500)
      )
    this.map.setCenter(marker.position)
    this.map.setZoom(15)
  }

  render() {
    return (
      <div>
      <div className='title-banner'>
        <h1 className='title'> Find me Pizza! </h1>
        <button id='hide-show-button' onClick={() => this.hideShowMenu()} tabIndex='1' ><img id='hamburger-icon-image' alt= 'menu-icon' src='https://css-tricks.com/wp-content/uploads/2012/10/threelines.png'/></button>
      </div>
      <div id='sidebar'>
        <input tabIndex='2' value={this.state.query} placeholder='Search a Pizza Place' onChange = {(e) => {this.filterVenues(e.target.value)}}/>
        {
          this.state.venueList && this.state.venueList.length > 0 && this.state.venueList.map(( venue, index ) => (
            <div tabIndex='3' key={index} className='venue-list' onClick = {(e) => {this.venueInfo(venue)}}>
              {venue.name}
            </div>
          ))
        }
      </div>

      <div id="map" />

      </div>
    )
  }
}

export default App;

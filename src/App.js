import React, { Component } from 'react';

import { load_google_maps } from './mapAPI.js';
import { load_fourSquare_API } from './fourSquareAPI.js'
import './App.css'

// adding sidebar open and close functionality
function hideShowMenu() {
  var sidebar = document.getElementById("sidebar");
  if (sidebar.style.display === "none") {
    sidebar.style.display = "block";
  } else {
    sidebar.style.display = "none";
  }
}

class App extends Component {
  state = {
    query: '',
    venueList: {}
  }

// Developed promises with the aid of Ryan Waite's Walkthrough
  componentDidMount() {
    // creating promise to ensure return of asynchronous API requests
    Promise.all([
      load_google_maps(),
      load_fourSquare_API()
    ])
    .then(values => {
      // deconstructing the response
      let google = values[0]; // Google Promise response
      this.venues = values[1].response.venues; // Four Sqaure Promise response
      this.markers = []; // creating empty array of markers
      this.informationwindow = new google.maps.InfoWindow(); // assigning infowindow variable
      this.map = new google.maps.Map(document.getElementById("map"), { // displaying map
        zoom: 11,
        center: { lat: this.venues[15].location.lat, lng: this.venues[15].location.lng }
      })

      // applying a marker to each venue
      this.venues.forEach(ven => {
        let mark = new google.maps.Marker({
          position: { lat: ven.location.lat, lng: ven.location.lng },
          venues: ven,
          id: ven.id,
          name: ven.name,
          map: this.map,
          animation: google.maps.Animation.DROP,
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        })
        this.markers.push(mark)

        // adding infowindow to markers
        google.maps.event.addListener(mark, 'click', () => {
          let streetViewImage = 'https://maps.googleapis.com/maps/api/streetview?size=150x150&location=' + ven.location.lat + ',' + ven.location.lng + '&heading=151.78&pitch=-0.76&key=AIzaSyBLTp-LXOA-37eNiP6Bw9m-MzLu73D9O2o';
          // infowindow information
          var information = '<div id="infowindow">' +
          `<h2> ${ven.name} </h2>
          <p> ${ven.location.address}</p>
          <p> ${ven.location.formattedAddress[1]} </p>` +
          '<img className="image" alt="' + ven.name + '" src="' + streetViewImage + '"/>' +
          '</div>';

          this.informationwindow.setContent(information);
          this.informationwindow.open(this.map, mark);
          this.map.setCenter(mark.position)
          this.map.setZoom(15)

          // closing sidebar to show infowindow without sidebar overlapping
          if (window.innerWidth <= 770) {
            var sidebar = document.getElementById("sidebar");
            sidebar.style.display = "none";
          }
        })

        // adding animation to the markers
        mark.addListener('mouseover', () => {
          mark.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png")
        })

        mark.addListener('mouseout', () => {
          mark.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png")
        })

        // opening sidebar on smaller screens after the infowindow is closed

        // google.maps.event.addListener(this.infowindow,'closeclick', function(){
        //
        //   if (window.innerWidth <= 770) {
        //     var sidebar = document.getElementById("sidebar");
        //     sidebar.style.display = "block";
        //     // this.setState({ sidebar: 'open' })
        //   }
        // })
      })
    this.setState({ venueList: this.venues }) // adding venues info to venueList
    })
    .catch( (error) => {
        alert('UH OH ... I am unable to load the page')
    })
  }

  // filtering venues with user input
  filterVenues(query) {
    let filteredVenues =  this.venues.filter(venue => venue.name.toLowerCase().includes(query.toLowerCase()));
    this.markers.forEach( mrkr => {
        if (mrkr.name.toLowerCase().includes(query.toLowerCase()) === true) {
          mrkr.setVisible(true)
        } else {
          mrkr.setVisible(false)
        }
    })
    this.setState({ venueList: filteredVenues, query })
  }

  // adding functionality of what happens when the user clicks on a venue in sidebar
  venueDetail = (venue) => {
    let marker = this.markers.filter(mr => mr.id === venue.id)[0]
    var information = marker.name;
    // var sidebar = document.getElementById("sidebar");

    this.informationwindow.setContent(information);
    this.informationwindow.open(this.map, marker);
    new Promise( (resolve) => {
          marker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png")
      })
      .then(
        setTimeout(() => {marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')}, 1500)
      )
    this.map.setCenter(marker.position)
    this.map.setZoom(13)

    // closing sidebar if the screen width is less than 600px
    if (window.innerWidth <= 700) {
      var sidebar = document.getElementById("sidebar");
      sidebar.style.display = "none";
    }
  }

  render() {
    return (
      <div>
      <div role='Heading' className='title-banner'>
        <h1 aria-label='heading' className='title'> Find me Pizza! </h1>
        <button role='Presentation' aria-hidden="true" id='hide-show-button' onClick={() => hideShowMenu()} tabIndex='1' ><img id='hamburger-icon-image' alt= 'menu-icon' src='https://css-tricks.com/wp-content/uploads/2012/10/threelines.png'/></button>
      </div>
      <div role='Menu' id='sidebar'>
        <p className="credit">***Venues procured using FourSquare API</p>
        <input aria-label='location filter' tabIndex='2' value={this.state.query} placeholder='Search a Pizza Place' onChange = {(e) => {this.filterVenues(e.target.value)}}/>
        {
          this.state.venueList && this.state.venueList.length > 0 && this.state.venueList.map(( venue ) => (
            <div tabIndex='3' key={venue.id} className='venue-list' onClick = {(e) => {this.venueDetail(venue)}} onKeyPress = {(e) => {this.venueDetail(venue)}}>
              {venue.name}
            </div>
          ))
        }
      </div>

      <div aira-label='location' id="map" />

      </div>
    )
  }
}

export default App;

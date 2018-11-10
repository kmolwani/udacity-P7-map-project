// Completed with the help of Ryan Waite's walkthrough video
export function load_google_maps() {
  return new Promise(function(resolve, reject) {
    // define the global callback that will run when google maps is loaded
    window.resolveGoogleMapsPromise = function() {
      // resolve the google object
      resolve(window.google);
      // delete the global callback to tidy up since it is no longer needed
      delete window.resolveGoogleMapsPromise;
    }
    // Now, Load the Google Maps API
    const script = document.createElement("script");
    const API_KEY = 'AIzaSyBLTp-LXOA-37eNiP6Bw9m-MzLu73D9O2o';
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${API_KEY}&callback=resolveGoogleMapsPromise`;
    script.async = true;
    document.body.appendChild(script);
  });
}

export function load_fourSquare_API() {
  let city = 'Atlanta, GA';
  let query = 'Pizza';
  let client_id = 'F2VBTCTDKYLP0JY2XEAJEQFOO3PURQG3CRKROB5HTCMSFUKH';
  let client_secret = 'B1OBOMKJETXB2Y5LN5QBI0ELJKKCXHHLAT3E4UJWNHO25B41'
  var fourSquareURL = 'https://api.foursquare.com/v2/venues/search?client_id=' + client_id + '&client_secret=' + client_secret + '&v=20183010%20&limit=50&near=' + city + '&query=' + query + '';
  return fetch(fourSquareURL)
  .then(response => response.json())
  .catch(error => {
    alert('UH OH ... I am unable to obtain venues')
  })
}

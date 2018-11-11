// Developed with the help of Ryan Waite's Walkthrough to load FourSquare API
// https://www.youtube.com/watch?v=5J6fs_BlVC0&app=desktop

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

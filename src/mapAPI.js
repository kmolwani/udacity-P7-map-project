// Developed with the help of Ryan Waite's Walkthrough to load Google Map
// https://www.youtube.com/watch?v=5J6fs_BlVC0&app=desktop

export function load_google_maps() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const apiKey = 'AIzaSyBLTp-LXOA-37eNiP6Bw9m-MzLu73D9O2o';
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${apiKey}&callback=resGMProm`;
    script.async = true;
    document.body.appendChild(script);

    window.resGMProm = function() {
      resolve(window.google)
      delete window.resGMProm;
    }
  })
}

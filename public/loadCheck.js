$(window).load(() => {
  setTimeout(() => {
    const map = document.body.querySelectorAll('.gm-err-content').length;
    // console.log({map}.HTMLCollection(1).length);
    console.log({map});
    if (map > 0) {
      const map = document.getElementById('map');
      alert("The Google API Key is not correct \n\n Please add the correct Key");
    }
    console.log(map)
  }, 2000);
})

const colorPreview = document.querySelector(".color-preview");
const btnNext = document.querySelector("#btnNext");
const inputs = document.querySelectorAll(".user-info-items");

const profile = {
    color: "",
    story: "",
    name: "",
    email: "",
    userCity: "",
    userState: "",
    userCountry: "",
    uid: 'u' + Date.now()
};

// Box & hue slider
var colorPicker = new iro.ColorPicker("#picker", {
    width: 200,
    color: "rgb(255, 255, 255)",
    borderWidth: 2,
    borderColor: "#000",
    layout: [
      {
        component: iro.ui.Box,
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: 'hue'
        }
      }
    ]
});



// listen to a color picker's color:change event
// color:change callbacks receive the current color
colorPicker.on('color:change', function(color) {
    // log the current color as a HEX string
    profile.color = color.hexString;
    colorPreview.style = "background-color:" + color.hexString;
    // document.body.style = "background-color:" + color.hexString;
  });

  inputs.forEach( item => {
      item.addEventListener("change", e => {
          profile[e.target.name] = e.target.value;
      });
  });


  btnNext.addEventListener( "click", e => {
      if(profile.color === "") {
          alert("Please select your color!");
      } else {
          uploadColor("prism", profile);
          window.location.href = `prism.html?color=${profile.color.substring(1)}&uid=${profile.uid}`;
      }
  });
const colorPreview = document.querySelector(".color-preview");
const btnNext = document.querySelector("#btnNext");
const inputs = document.querySelectorAll(".user-info-items");
const requiredItems = document.querySelectorAll(".required-user-item");
const colorInput = document.querySelector("#colorInput");
const btnHasAccount = document.querySelector("#hasAccount");
const accountInfo = document.querySelector("#accountInfo");

const profile = {
    color: "",
    story: "",
    username: "",
    email: "",
    userCity: "",
    userState: "",
    userCountry: "",
    uid: 'u' + Date.now(),
    hasAccount: false
};

// Box & hue slider
var colorPicker = new iro.ColorPicker("#picker", {
    width: 200,
    color: "rgb(255, 255, 255)",
    borderWidth: 2,
    borderColor: "#fff",
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
    
    
    if (color.hexString > "#888888") {
      colorPreview.style = "color: black; background-color:" + color.hexString;
      btnNext.style = "color: black; background-color:" + color.hexString;
    } else {
      colorPreview.style = "color: white; background-color:" + color.hexString;
      btnNext.style = "color: white; background-color:" + color.hexString;
    }

    colorInput.value = color.hexString;
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
        if (!isInputFilled(requiredItems)) {
          console.log(profile);
          uploadColor("prism", profile);
          window.location.href = `prism.html?color=${profile.color.substring(1)}&uid=${profile.uid}`;
        } else {
          alert("All questions must be answered, unless marked (optional).");
        }
          
      }
  });

const userInfoItems = document.querySelectorAll(".user-info-items");
const userName = document.querySelectorAll(".user-name");
const userRequiredInfo = document.querySelectorAll(".required-user-item");
const imagePreview = document.querySelector("#imagePreview");
const inputImage = document.querySelector("#fileImage");

const bagItems = document.querySelectorAll(".bag-item");
const bagImg = document.querySelector("#bagImg");
const fill = document.querySelector("#fill");

const uploadProgress = document.querySelector(".progress-bar");
//const uploadResult = document.querySelector(".progress-result");
const uploadOverlay = document.querySelector(".overlay-full");
const notifBar = document.querySelector("#notifBar");
const btnSubmit = document.querySelector("#btnSubmit");

let isUserInfoSubmitted = true;
let userID = Date.now();



let userProfile = {
    uid: userID,
    image: "http://map.ndsusodaa.com/sodaapeople/images/img_placeholder.png"
};

const bagContainer = {};

const showNotification = function (message) {
    notifBar.classList.remove("hide");
    notifBar.innerHTML = '<p>' + message + '</p><i class="fas fa-times-circle"></i>';
}

const highlightForms = function (items) {
    items.forEach(item => {
        item.classList.add("red-border");
    });
};

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.style = `background: url(${e.target.result}) #eee; background-size: contain; background-position: center top; background-repeat: no-repeat`;
        }

        reader.readAsDataURL(input.files[0]);
    }
}

inputImage.onchange = function () {
    if(this.files[0].size > 5297152) {
        alert("The file is too big! The maximum accepted file size is 5MB.");
       this.value = "";
    } else {
        readURL(this);
    }
}


const submitProfile = function () {

    if (isInputFilled(userRequiredInfo)) {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        alert("All the information are required");
        highlightForms(userRequiredInfo);
        return
    }


    const location = userProfile.street + " " + userProfile.userCity + " " + userProfile.userState + " " + userProfile.userCountry;
    geocode(location, (error, {
        latitude,
        longtitude,
        location
    } = {}) => {

        if (error) {
            console.log(error);
        }

        userProfile['longtitude'] = longtitude;
        userProfile['latitude'] = latitude;

        uploadeData("wanderer/" + userProfile.uid + '/', "wanderer", userProfile, userProfile.uid);

    });

    //showNotification('Your information is saved.');
    isUserInfoSubmitted = true;
};



userInfoItems.forEach(item => {
    
    item.addEventListener("change", e => {

        if (item.name === "image" ) {

            if( item.files[0] ) {
                userProfile[item.name] = item.files[0];
            }

        } else {

            isUserInfoSubmitted = false;
            btnSubmit.innerHTML = "Submit"
            uploadProgress.style = "width: 0%";

            userProfile[e.target.name] = e.target.value;

        }
    });

});


btnSubmit.addEventListener('click', function (e) {
    console.log(userID);

    e.preventDefault();
    submitProfile();
    userProfile.uid = Date.now();
});


notifBar.addEventListener("click", e => {
    e.currentTarget.classList.add("hide");
})


window.addEventListener('beforeunload', e => {
    if (!isUserInfoSubmitted) {
        e.preventDefault();
        e.returnValue = "Your information is not submitted. Are you sure you want to leave?";
    }
});

bagItems.forEach( (item, i) => {
    item.addEventListener("change", e => {
        if ( e.target.value.length > 1 ) {
            bagContainer[i] = e.target.value;
            console.log(bagContainer);
            fill.style = `height: ${ Object.values(bagContainer).length / bagItems.length * bagImg.offsetHeight}px`;
        } else {
            delete bagContainer[i];
            console.log(bagContainer);
            fill.style = `height: ${ Object.values(bagContainer).length / bagItems.length * bagImg.offsetHeight}px`;
        }
    });
})
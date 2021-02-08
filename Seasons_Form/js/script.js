

const userInfoItems = document.querySelectorAll(".user-info-items");
const userName = document.querySelectorAll(".user-name");
const major = document.querySelector("#major");
const userRequiredInfo = document.querySelectorAll(".required-user-item");


const imagePreview = document.querySelector("#imagePreview");
const inputImage = document.querySelector("#fileImage");
const projectAttachmentTitle = document.querySelector("#attachmentTitle");
const btnAttach = document.querySelector("#btnAttach");

const uploadProgress = document.querySelector(".progress-bar");
const uploadOverlay = document.querySelector(".overlay-full");
const notifBar = document.querySelector("#notifBar");

const btnUploadSuccess = document.querySelector("#btnUploadSuccess");
const btnSubmit = document.querySelector("#btnSubmit");


let isUserInfoSubmitted = true;
let userID = Date.now();
console.log(userID);
let isEditing = false;
let projectImageSelected = false;
let editingPid = "";





let userProfile = {
    uid: userID,
    image: "http://map.ndsusodaa.com/sodaapeople/images/img_placeholder.png"
};


function loadUserInfo(id) {
    db.ref("alumninetwork/user/" + id).once("value").then(snapshot => {

        const data = snapshot.val();

        Object.assign(userProfile, data);

        console.log(data);
        console.log(userProfile);
        if (data) {
            userInfoItems.forEach(item => {
                if (item.name !== "image") {
                    item.value = data[item.name];
                } else {
                    imagePreview.style = `background: url(${data["image"]}) #eee; background-size: contain; background-position: center top; background-repeat: no-repeat`;
                    imagePreview.dataset.imageurl = data["image"];
                }
            });

            showNotification('Welcome back. Your informatin is loaded.');
            setTimeout(() => {
                notifBar.classList.add("hide");
            }, 3000);
        }

    });
}

function loadProjects(id) {
    db.ref("alumninetwork/projects").orderByChild("uid").equalTo(id).once("value").then(snapshot => {
        if (snapshot.val()) {
            projects = snapshot.val();
            console.log(projects);
            for (key in projects) {
                createProjectCard(projects[key]);
            }
            const projectImgLinks = document.querySelectorAll(".loadedImage");
        }

    });
}




const showNotification = function (message) {
    notifBar.classList.remove("hide");
    notifBar.innerHTML = '<p>' + message + '</p><i class="fas fa-times-circle"></i>';
}



const deleteProject = function (recordID) {
    if (recordID[0] === 'p') {
        db.ref("alumninetwork/projects/" + recordID).remove();
        //deleteImage(recordID);
    } else if (recordID[0] === 'u') {
        db.ref("alumninetwork/user/" + recordID).remove();
    }
};


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            document.querySelector("#videoSrc").src = e.target.result;
            document.querySelector("#videoPlayer").load();
        }

        reader.readAsDataURL(input.files[0]);
    }
}

inputImage.onchange = function () {
    readURL(this);
    // if(this.files[0].size > 2097152) {
    //     alert("The file is too big! The maximum accepted file size is 2MB.");
    //    this.value = "";
    // } else {
    //     readURL(this);
    // }
}



const uploadProfile = function (dbPath, imgStorePath, dataObj, fileID) {

    let clearedData = {
        ...dataObj
    };
    delete clearedData.image;

    db.ref(dbPath).update(clearedData);


    if (dataObj.image === '') {
        db.ref(dbPath + "image").set("");
    } else {
        uploadImage(dbPath, imgStorePath, dataObj, fileID);
    }
    console.log(dataObj);

};

const highlightForms = function (items) {
    items.forEach(item => {
        item.classList.add("red-border");
    });
};

const submitProfile = function () {
    if (isInputFilled(userRequiredInfo)) {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        alert("Please complete the required information.");
        highlightForms(userRequiredInfo);
        return
    }

    //uploadOverlay.classList.remove("hide");
    userInfoItems.forEach(info => {
        if (info.name === "image" ) {
            if( info.files[0] ) {
                userProfile[info.name] = info.files[0];
            }
        } else {
            userProfile[info.name] = info.value;
        }
    });

    userProfile["uid"] = userID;

    const location = userProfile.userCity + " " + userProfile.userState + " " + userProfile.userCountry;
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

        uploadeData("seasons/" + userID + '/', "seasons", userProfile, userProfile.uid);

    });

    showNotification('Your profile is saved.');
    isUserInfoSubmitted = true;
};



userInfoItems.forEach(item => {
    item.addEventListener("change", e => {
        isUserInfoSubmitted = false;
        btnSubmit.innerHTML = "Save my Information"
        uploadProgress.style = "width: 0%";
    });
});




btnSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    submitProfile();
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
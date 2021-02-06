const db = firebase.database();
const storage = firebase.storage();

const userInfoItems = document.querySelectorAll(".user-info-items");
const userName = document.querySelectorAll(".user-name");
const major = document.querySelector("#major");
const userRequiredInfo = document.querySelectorAll(".required-user-item");
const projectRequiredInfo = document.querySelectorAll(".required-project-item");
const projectEditor = document.querySelector("#projectEditor");


const projectInfoItems = document.querySelectorAll(".project-info-items")
const imagePreview = document.querySelector("#imagePreview");
const inputImage = document.querySelector("#fileImage");
const projectImage = document.querySelector("#projectImage");
const projectAttachmentTitle = document.querySelector("#attachmentTitle");
const btnAttach = document.querySelector("#btnAttach");

const uploadProgress = document.querySelector(".progress-bar");
const uploadOverlay = document.querySelector(".overlay-full");
const notifBar = document.querySelector("#notifBar");

const btnUploadSuccess = document.querySelector("#btnUploadSuccess");
const btnSubmit = document.querySelector("#btnSubmit");
const btnAddNew = document.querySelector("#btnAddNew");
const btnEditSave = document.querySelector("#btnEditSave");
const btnEditCancel = document.querySelector("#btnEditCancel");

const progressContainer = document.querySelector("#progressContainer");

const projectContainer = document.querySelector("#projectContainer");
let btnDeleteCard = document.querySelectorAll(".delete-btn");

let isUserInfoSubmitted = true;
let userID;
let isEditing = false;
let projectImageSelected = false;
let editingPid = "";





let userProfile = {
    uid: userID,
    image: "http://map.ndsusodaa.com/sodaapeople/images/img_placeholder.png"
};

let projects = {};
let project = {
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


const showEditBtn = function (isEditing) {
    if (isEditing) {
        btnEditSave.classList.remove("hide");
        btnEditCancel.classList.remove("hide");
        btnAddNew.classList.add("hide");
        projectEditor.classList.add("edit-project");
    } else {
        btnEditSave.classList.add("hide");
        btnEditCancel.classList.add("hide");
        btnAddNew.classList.remove("hide");
        projectEditor.classList.remove("edit-project");
    }
}

const showNotification = function (message) {
    notifBar.classList.remove("hide");
    notifBar.innerHTML = '<p>' + message + '</p><i class="fas fa-times-circle"></i>';
}

const createProject = function (projectID = 'p' + Date.now()) {

    projectInfoItems.forEach(item => {
        if (item.name === "image" && item.files[0]) {
            project[item.name] = item.files[0];
        } else {
            project[item.name] = item.value;
        }
        item.value = "";
    });

    project.pid = projectID;
    project.uid = userID;

    projects[projectID] = project;

    return project;
};

const deleteImage = function (fileName) {
    storage.ref().child(imagePath + '/' + fileName).delete().then(() => {
        console.log("Image deleted!");
    }).catch(error => {
        console.log(error);
    });
};

const deleteProject = function (recordID) {
    if (recordID[0] === 'p') {
        db.ref("alumninetwork/projects/" + recordID).remove();
        //deleteImage(recordID);
    } else if (recordID[0] === 'u') {
        db.ref("alumninetwork/user/" + recordID).remove();
    }
};

const editProject = function (recordID) {
    db.ref("alumninetwork/projects/" + recordID).once("value").then(snapshot => {
        const data = snapshot.val();
        if (data) {
            console.log(data.image);
            projectInfoItems.forEach(item => {
                if (item.name !== "image") {
                    item.value = data[item.name];
                }
            });

            for (key in data) {
                project[key] = data[key];
            }

            if (data.image && data.image.length > 5) {
                projectAttachmentTitle.innerHTML = `<a href="${data.image}" class="image-preview-link" target="_blank">View Image</a>`;
                btnAttach.innerHTML = "Remove Image";
                projectImageSelected = true;
            } else {
                projectAttachmentTitle.innerHTML = "No image selected.";
                btnAttach.innerHTML = "Select Image";
                projectImageSelected = false;
            }
        }

    });
    showEditBtn(true);
}


const createProjectCard = function (item) {

    let imageName;

    if (item.image) {
        if (item && typeof (item.image) === "string") {
            imageName = `<a href="${item.image}" class="image-preview-link" target="_blank">View Image</a>`
        } else {
            imageName = item.image.name
        }
    } else {
        imageName = "Not Selected."
    }

    let location = item.location ? item.location + ', ' : '';

    let newCard = document.createElement("div");
    newCard.className = "project-card";
    newCard.innerHTML = `<div class="project-content">
                            <div class="project-info">
                                <h3 class="name">${item.name}</h3>
                                <div class="project-details">
                                    <p>${item.year} | ${item.website}</p>
                                    <p><b>Location: </b>${location}${item.city}, ${item.state}, ${item.country}</p>
                                    <p class="loadedImage"><b>Image: </b>${imageName}</p>
                                </div>
                             </div>
                            <div class="project-description">
                                <p>${item.description}</p>
                            </div>
                        </div>`;

    const rightBtn = document.createElement("div");
    rightBtn.className = "project-operations";

    const btnEditEl = document.createElement("div");
    btnEditEl.className = "operation-btn edit-btn";
    btnEditEl.dataset.pkey = item.pid;
    const editIconEl = document.createElement('i');
    editIconEl.className = "fas fa-edit";

    const btnDeleteEl = document.createElement("div");
    btnDeleteEl.className = "operation-btn delete-btn";
    btnDeleteEl.dataset.pkey = item.pid;
    const deleteIconEl = document.createElement("i");
    deleteIconEl.className = "fas fa-trash";

    btnEditEl.appendChild(editIconEl);
    btnDeleteEl.appendChild(deleteIconEl);

    btnEditEl.addEventListener("click", e => {
        isEditing = true;
        editingPid = item.pid;
        editProject(editingPid);

    });

    btnDeleteEl.addEventListener("click", e => {
        const confirmDelete = confirm(`Are you sure you want to delete the ${item.type} ${item.name}?`);
        if (confirmDelete) {
            btnDeleteEl.parentNode.parentNode.remove();
            delete projects[item.pid];
            deleteProject(item.pid);
            console.log(projects);
        } else {
            return;
        }

    });

    rightBtn.append(btnEditEl, btnDeleteEl);
    newCard.appendChild(rightBtn);

    projectContainer.appendChild(newCard);

}


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


document.querySelector("#videoPlayer").onclick = function(){document.querySelector("#videoPlayer").play();}

inputImage.onchange = function () {
    readURL(this);
    // if(this.files[0].size > 2097152) {
    //     alert("The file is too big! The maximum accepted file size is 2MB.");
    //    this.value = "";
    // } else {
    //     readURL(this);
    // }
}

const uploadImage = function (dbPath, imgStorePath, project, id) {
    const imgFile = project.image;
    if (imgFile.name) {

        return new Promise((resolve, reject) => {
            const fileName = id + imgFile.name.substring(imgFile.name.indexOf('.'));

            const uploadTask = storage.ref().child(imgStorePath + '/' + fileName).put(imgFile);

            uploadProgress.style = `width: 0%`;
            // uploadProgress.innerHTML = '0%';

            uploadTask.on('state_changed', snapshot => {

                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploadProgress.style = `width: ${progress}%`;
                // uploadProgress.innerHTML = progress + '%';
                progressContainer.classList.remove("hide");

            }, err => {
                console.log(err);
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then(url => {

                    db.ref(dbPath + "image").set(url);
                    progressContainer.classList.add("hide");
                    project.image = url;

                    if (dbPath.includes("alumninetwork/projects/")) {
                        createProjectCard(project);
                        showNotification(`The project ${project.name} is saved.`);
                    }

                });
            });
        });

    } else {
        uploadProgress.style = "width: 100%";
    }
};
// zhenhua.yang.1@ndsu.edu
const uploadeData = function (dbPath, imgStorePath, dataObj, fileID) {

    let clearedData = {
        ...dataObj
    };
    delete clearedData.image;

    db.ref(dbPath).update(clearedData);


    if (dataObj.image === '') {
        if (dbPath.includes("alumninetwork/projects")) {
            createProjectCard(project);
            showNotification(`The project ${project.name} is saved.`);
        }
        db.ref(dbPath + "image").set("");
    } else {
        uploadImage(dbPath, imgStorePath, dataObj, fileID);
    }
    console.log(dataObj);

};

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

        uploadeData("alumninetwork/user/" + userID + '/', "sodaa-alumni-image", userProfile, userProfile.uid);

    });

    showNotification('Your profile is saved.');
    isUserInfoSubmitted = true;
};

const submitProject = function (projectID) {

    if (isInputFilled(projectRequiredInfo)) {
        highlightForms(projectRequiredInfo);
        alert("Name, city, state, and country are required.");
        return;
    }

    if (!isUserInfoSubmitted) {
        submitProfile();
    }

    project = createProject(projectID);


    project.author = userName[0].value + ' ' + userName[1].value;
    project.major = major.value;

    const projectLocation = project.city + " " + project.state + " " + project.country;


    geocode(projectLocation, (error, {
        latitude,
        longtitude,
        location
    } = {}) => {

        if (error) {
            console.log(error);
        }

        project['longtitude'] = longtitude;
        project['latitude'] = latitude;

        uploadeData("alumninetwork/projects/" + project.pid + '/', "sodaa-alumni-project-image", project, project.pid);

    });


    setTimeout(e => {
        notifBar.classList.add("hide");
    }, 5000);
}


// 
// 
// 
// 




userInfoItems.forEach(item => {
    item.addEventListener("change", e => {
        isUserInfoSubmitted = false;
        showNotification('Your changes have been not saved yet.');
        btnSubmit.innerHTML = "Save my Information"
        uploadProgress.style = "width: 0%";
    });
});




btnSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    submitProfile();
});

projectInfoItems.forEach(info => {
    info.addEventListener('click', e => {
        if (isInputFilled(userRequiredInfo)) {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            alert("Please complete your profile first.");
            highlightForms(userRequiredInfo);
        }
    });

});

notifBar.addEventListener("click", e => {
    e.currentTarget.classList.add("hide");
})




// projectImage.addEventListener("change", e => {

//     projectAttachmentTitle.innerHTML = e.target.files[0].name;
//     btnAttach.innerHTML = "Remove Image";

// });

// btnAttach.addEventListener("click", e => {
//     if (projectImageSelected) {
//         // TODO: remove attached file.
//         const confirmRemoveImg = confirm("Are you sure you want to remove this image?");
//         if (confirmRemoveImg) {
//             projectImage.value = "";
//             btnAttach.innerHTML = "Select Image";
//             projectAttachmentTitle.innerHTML = "No file has been selected yet.";
//             project.image = "";
//             console.log(project);
//             projectImageSelected = !projectImageSelected;
//         }

//     } else {
//         projectImage.click();
//         projectImageSelected = !projectImageSelected;
//     }

// });

window.addEventListener('beforeunload', e => {
    if (!isUserInfoSubmitted) {
        e.preventDefault();
        e.returnValue = "Your information is not submitted. Are you sure you want to leave?";
    }
});
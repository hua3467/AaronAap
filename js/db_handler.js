
const progressContainer = document.querySelector("#progressContainer");
const uploadResult = document.querySelector(".progress-result");
const btnGroupSubmitted = document.querySelector(".btn-group-submitted");

const uploadImage = function (dbPath, imgStorePath, project, id) {

    const imgFile = project.image;

    if (imgFile.name) {

        return new Promise((resolve, reject) => {
            const fileName = id + imgFile.name.substring(imgFile.name.indexOf('.'));

            const uploadTask = storage.ref().child(imgStorePath + '/' + fileName).put(imgFile);

            uploadProgress.style = `width: 0%`;

            uploadTask.on('state_changed', snapshot => {

                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                uploadProgress.style = `width: ${progress}%`;
                progressContainer.classList.remove("hide");

            }, err => {
                console.log(err);
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then(url => {

                    db.ref(dbPath + "image").set(url);
                    project.image = url;
                    if (uploadResult) {
                        uploadResult.innerHTML = "Your information was saved successfully.";
                    }
                    if (btnGroupSubmitted) {
                        btnGroupSubmitted.classList.remove("hide");
                    }
                });
            });
        });

    } else {
        uploadProgress.style = "width: 100%";
    }
};

const uploadeData = function (dbPath, imgStorePath, dataObj, fileID) {

    let clearedData = {
        ...dataObj
    };
    delete clearedData.image;

    db.ref(dbPath).update(clearedData);
    uploadImage(dbPath, imgStorePath, dataObj, fileID);

    console.log(dataObj);

};

const deleteImage = function (fileName) {
    storage.ref().child(imagePath + '/' + fileName).delete().then(() => {
        console.log("Image deleted!");
    }).catch(error => {
        console.log(error);
    });
};

const uploadColor = function(dbPath, profile) {
    db.ref(dbPath + '/' + profile.uid).update(profile);
}

const getColorInfo = function(dbPath, uid, callback) {
    db.ref(dbPath + '/' + uid).once("value").then( snapshot => {
        callback(snapshot.val());
    });
};

const getColor = function(dbPath, callback) {
    db.ref(dbPath).once("value").then( snapshot => {
        callback(snapshot.val());
    });
};

const getData = function(projectName, callback) {
    db.ref(projectName).on("value", snapshot => {
        // console.log(snapshot.val());
        callback(snapshot.val());
    });
}

const deleteData = function(projectName, id, callback) {
    db.ref(projectName + '/' + id).remove();
    callback();
}
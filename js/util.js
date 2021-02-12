// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyD7LNvOL26cGrZKmWJxwlwwdFxRF2hstME",
    authDomain: "time-capsule-43322.firebaseapp.com",
    databaseURL: "https://time-capsule-43322-default-rtdb.firebaseio.com/",
    projectId: "time-capsule-43322",
    storageBucket: "time-capsule-43322.appspot.com",
    messagingSenderId: "536145783566",
    appId: "1:536145783566:web:165d6d7dc6e53bc009c55f",
    measurementId: "G-V0N9H5ZW9S"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

const parseURL = function(url) {
    let pattern = /^((http|https|ftp):\/\/)/;
    if(!pattern.test(url)) {
        url = "https://" + url;
    }
    return url;
}

let isInputFilled = function(form){
    const items = [...form];
    console.log(items.some( input => input.value.length < 1));
    return items.some( input => input.value.length < 1);
}

const passwordValidate = function (password1, password2, callback) {
    if (password1 === password2) {
        callback();
    } else {
        alert("Password not match!");
    }
};

function validateFileType(file){
    if (file) {
        var fileName = file.name;
    console.log(fileName);
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile=="jpg" || extFile=="jpeg" || extFile=="png" || extFile=="gif" || extFile=="svg"){
        return true;
    }else{
        alert("Accepted file extentions: jpg/jpeg, png, gif, and svg.");
        return false;
    } 
    }
      
}

function validateFileSize(file) {
    if (file) {
        if(file.size > 2097152){
            alert("File is too big! Biggest accepted file size is 2MB.");
            return false;
         }
         return true;
    }
    
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
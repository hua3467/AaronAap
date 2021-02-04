const parseURL = function(url) {
    let pattern = /^((http|https|ftp):\/\/)/;
    if(!pattern.test(url)) {
        url = "https://" + url;
    }
    return url;
}

let isInputFilled = function(form){
    const items = [...form]
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
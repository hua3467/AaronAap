const imageMatrix = document.querySelector(".image-matrix");
let imageSrc = [];
let randomeTime;

db.ref("alumninetwork")
    .once("value")
    .then((snapshot) => {

        //console.log(snapshot.val().data.features);
        const userData = snapshot.val().data.features

        userData.forEach( user => {
            if (user.properties["image-url"] && user.properties["image-url"].includes("http")) {
                imageSrc.push(user.properties["image-url"]);
            }
        });

        shuffle(imageSrc);

        for (let i = 0; i < 10; i++) {
            const singleImage = document.createElement("div");
            singleImage.className = "single-image";
            singleImage.style = `background: url("${imageSrc.shift()}"); background-size: cover; background-position: center`;
            console.log(i, imageSrc[i]);
            imageMatrix.appendChild(singleImage);
        }

        setInterval(() => {

            randomContainerIndex = Math.floor(Math.random() * (9 - 0) + 0);
            const images = document.querySelectorAll(".single-image");
            currentImage = images[randomContainerIndex].style.backgroundImage;
            imageSrc.push(currentImage.substring(5, currentImage.length-2));
            images[randomContainerIndex].style = `background: url("${imageSrc.shift()}"); background-size: cover; background-position: center`;
            
        }, 5000);
    })



function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
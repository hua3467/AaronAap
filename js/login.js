const auth = firebase.auth();

const userIDBox = document.querySelector("#userID");
const userPWBox = document.querySelector("#userPassword");
const loginBox = document.querySelector(".login");
const btnLogin = document.querySelector("#btnLogin");
const btnSignOut = document.querySelector("#btnSignOut");

const userIDCreate = document.querySelector("#userIDCreate");
const userPasswordCreate = document.querySelector("#userPasswordCreate");
const userPasswordAgain = document.querySelector("#userPasswordAgain");
const btnSignUp = document.querySelector("#btnSignUp");

const userEmailBox = document.querySelector("#userEmail");
const btnSendLink = document.querySelector("#btnSendLink");

const currentPassword = document.querySelector("#currentPassword");
const newPassword = document.querySelector("#newPassword");
const newPasswordAgain = document.querySelector("#newPasswordAgain");
const btnChangePW = document.querySelector("#btnChangePW");
const mcEmailField = document.querySelector("#mce-EMAIL");

let userEmail;
let userPassword;


if (state === "login") {
    btnLogin.addEventListener("click", e => {

        userEmail = userIDBox.value;
        userPassword = userPWBox.value;
        //auth.createUserWithEmailAndPassword(userEmail, userPassword);
        const promise = auth.signInWithEmailAndPassword(userEmail, userPassword);
    
        promise
            .then(firebaseUser => {
                loginBox.classList.add("hide");
                userID = firebaseUser.user.uid;
            })
            .catch(e => {
                console.log(e);

                if (e.code === "auth/user-not-found") {
                    alert("The user is not found. Please double check your email address or create an account.");
                } else if (e.code === "auth/wrong-password") {
                    alert("Your password is incorrect. Please try again or reset your password.");
                }
                
            });
    });



    btnSignUp.addEventListener("click", e => {

        userPassword = passwordValidate(userPasswordCreate.value, userPasswordAgain.value, e => {
            
            userEmail = userIDCreate.value;
            userPassword = userPasswordAgain.value;
    
            const promise = auth.createUserWithEmailAndPassword(userEmail, userPassword);
            promise.catch(e => {
                alert(e.message);
            });
        });
        
    });



    btnSignOut.addEventListener("click", e => {
        auth.signOut().then( e => {
            loginBox.classList.remove("hide");
            userEmail = "";
            userPassword = "";
            window.location.reload();
        });
    })
}
    
if (state === "forgetPW") {
    btnSendLink.addEventListener("click", e => {
        userEmail = userEmailBox.value
        if (userEmail.length > 3 && userEmail.includes('@')) {
            auth.sendPasswordResetEmail(userEmail).then( () => {
                alert("A password reset email has been sent to your email address. If you did not find it, please check your junk box.");   
            }).catch( error => {
                alert("The email address has not been registered. Please double check your input or create a new account.");
            });
        } else {
            alert("Please double check the email address you entered.");
        }
        
    });

    btnChangePW.addEventListener("click", e => {

    })
}


firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        userID = firebaseUser.uid;
        mcEmailField.value = firebaseUser.email;
        loginBox.classList.add("hide");
        loadUserInfo(userID);
        loadProjects(userID);
    } else {
        console.log("Not logged in.");
    }
});
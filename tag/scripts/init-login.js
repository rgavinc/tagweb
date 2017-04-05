let currentUserUID = "";
var promiseCount = 0;
let loading = true;
/**
    * Handles the sign in button press.
    */
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            document.getElementById('quickstart-sign-in').disabled = false;
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    document.getElementById('quickstart-sign-in').disabled = true;
}

/**
 * Handles the sign up button press.
 */
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END createwithemail]
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function () {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}

function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function (user) {
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
            // User is signed in.
            // window.location.href = "app.html";
            currentUserUID = user.uid;
            document.getElementById("signin").remove();
            testPromise()

            // var displayName = user.displayName;
            // var email = user.email;
            // var emailVerified = user.emailVerified;
            // var photoURL = user.photoURL;
            // var isAnonymous = user.isAnonymous;
            // var uid = user.uid;
            // var providerData = user.providerData;
            // [START_EXCLUDE]
            // document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            // document.getElementById('quickstart-sign-in').textContent = 'Sign out';
            // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            if (!emailVerified) {
                document.getElementById('quickstart-verify-email').disabled = false;
            }
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            document.getElementById('quickstart-sign-in').textContent = 'Sign in';
            document.getElementById('quickstart-account-details').textContent = 'null';
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]

    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
    document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
    document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
}

window.onload = function () {
    initApp();
};

function testPromise() {
    let p1 = new Promise(
        (resolve, reject) => {
            w3IncludeHTML();
            window.setTimeout(
                function () {
                    resolve("hey");
                }, 500);
        }
    );

    p1.then(
        function (val) {
            fillView();
        })
        .catch(
        (reason) => {
            console.log('Handle rejected promise (' + reason + ') here.');
        });
}

let fillView = () => {
    return firebase.database().ref('/events').once('value').then(function (snapshot) {
                snapshot.forEach(function(childSnapshot){
                    let eventName = childSnapshot.child("eventName").val();
                    let eventPicture = childSnapshot.child("eventPicture").val();
                    let eventSummary = childSnapshot.child("eventSummary").val();
                    let location = childSnapshot.child("location").val();
                    let owner = childSnapshot.child("owner").val();
                    let time = childSnapshot.child("time").val();

                    let article = document.createElement("article");
                    let titleH = document.createElement("h2");
                    titleH.innerHTML = eventName;
                    let imageHolder = document.createElement("div");
                    imageHolder.className = "image-holder";
                    let img = document.createElement("img");
                    img.src = "images/16_9.jpg";
                    let imgOverlay = document.createElement("img");
                    imgOverlay.className = "img-overlay";
                    imgOverlay.src = "images/image_overlay.png";
                    let locationH = document.createElement("h1");
                    locationH.className = "location";
                    locationH.innerHTML = location;
                    let timeH = document.createElement("h1");
                    timeH.className = "time";
                    timeH.innerHTML = time;
                    let eventSummaryH = document.createElement("h2");
                    eventSummaryH.className = "description";
                    eventSummaryH.innerHTML = eventSummary;
                    let ownerH = document.createElement("h2");
                    ownerH.className = "host";
                    ownerH.innerHTML = owner;

                    console.log(eventPicture);
                    article.appendChild(titleH);
                    imageHolder.appendChild(img);
                    imageHolder.appendChild(imgOverlay);
                    imageHolder.appendChild(locationH);
                    imageHolder.appendChild(timeH);
                    article.appendChild(imageHolder);
                    article.appendChild(eventSummaryH);
                    article.appendChild(ownerH);
                    document.getElementById("main").appendChild(article);
                })
                
            });
}

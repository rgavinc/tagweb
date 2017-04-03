let alertLogin = () => {
    var userId = firebase.auth().currentUser.uid;
    alert(userId);
}
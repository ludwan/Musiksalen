//Creating new accounts

//Fetched from https://www.firebase.com/docs/web/guide/login/password.html

var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
ref.createUser({
  email    : "bobtony@firebase.com",
  password : "correcthorsebatterystaple"
}, function(error, userData) {
  if (error) {
    console.log("Error creating user:", error);
  } else {
    console.log("Successfully created user account with uid:", userData.uid);
  }
});


//logging in

var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
ref.authWithPassword({
  email    : "bobtony@firebase.com",
  password : "correcthorsebatterystaple"
}, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
});
musiksalenApp.controller('HeaderCtrl', function($scope, userService){	

	$scope.loggedIn = function(){
        return (userService.userId != null);
    };

    // Create a callback which logs the current auth state
	var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");
	ref.onAuth(function(authData) {
	  if (authData) {
	  	console.log(authData);
	    console.log("User " + authData.uid + " is logged in with " + authData.provider);
	    userService.setUserId(authData.uid);
	    userService.setUserName(authData.password.email);
	  } else {
	    console.log("User is logged out");
	  }
	});
});
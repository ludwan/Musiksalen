musiksalenApp.controller('HeaderCtrl', function($scope, userService){	

	$scope.loggedIn = function(){
        return (userService.userId != null);
    };

	var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");
	ref.onAuth(function(authData) {
	  if (authData) {
	    userService.setUserId(authData.uid);
	    userService.setUserName(authData.password.email);
	  } else {
	    console.log("User is logged out");
	  }
	});
});
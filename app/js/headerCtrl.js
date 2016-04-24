musiksalenApp.controller('HeaderCtrl', function($scope, userService){	

	//This function is for seeing if a user is currently logged in or not
	//depending on the answer certain buttons are displayed on the header
	$scope.loggedIn = function(){
        return (userService.userId != null);
    };

    //This is for seeing if a user is currently authenticated to the browser
    //meaning if a user is currently logged in. If that is so then the user
    //id and email will be set in the userService for other controllers
    //to use. 
	var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");
	ref.onAuth(function(authData) {
	  if (authData) {
	    userService.setUserId(authData.uid);
	    userService.setUserName(authData.password.email);
	  }
	});
});
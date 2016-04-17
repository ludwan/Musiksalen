musiksalenApp.controller('LoginCtrl', function($scope, userService, $location){


	$scope.login = function() {
		$scope.loading = true;
		var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");

		ref.authWithPassword({
		  email    : $scope.user,
		  password : $scope.password
		}, function(error, authData) {
			if (error) {
				$scope.loading = false;
			    switch (error.code) {
				    case "INVALID_EMAIL":
				        console.log("The specified user account email is invalid.");
				        break;
				    case "INVALID_PASSWORD":
				        console.log("The specified user account password is incorrect.");
				        break;
				    case "INVALID_USER":
				        console.log("The specified user account does not exist.");
				        break;
				    default:
				        console.log("Error logging user in:", error);
			    }
			    $scope.$apply();
			} else {
				$scope.loading = false;
				userService.setUserId(authData.uid);
			    console.log("Authenticated successfully with payload:", authData);
			    $location.path('/home');	//TODO change this to "My account" page instead of "home"
			    $scope.$apply();
			}
		});
	}

});

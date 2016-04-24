musiksalenApp.controller('LoginCtrl', function($scope, userService, $location){
	$scope.loading = 0;

	//This function logs a user in via email and password. If invalid credentials
	//are given the proper error message will be shown. If the 
	//credentials are valid then the user will be logged in and authenticated at the backend 
	//and the user will be redirected to the myAccount page.
	$scope.login = function() {
		$scope.loading = 1;

    	$scope.error = false;

		var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");

		ref.authWithPassword({
		  email    : $scope.user,
		  password : $scope.password
		}, function(error, authData) {
			if (error) {
				$scope.loading = 0;
			    switch (error.code) {
				    case "INVALID_EMAIL":
				    	$scope.error = true;
				    	$scope.errorMessage = "The specified user account email is invalid.";
				        break;
				    case "INVALID_PASSWORD":
				    	$scope.error = true;
				    	$scope.errorMessage = "The specified user account password is incorrect.";
				        break;
				    case "INVALID_USER":
				    	$scope.error = true;
				    	$scope.errorMessage = "The specified user account does not exist.";
				        break;
				    default:
				    	$scope.error = true;
				    	$scope.errorMessage = "Error logging user in:" + error;
			    }
			    $scope.$apply();
			} else {
				$scope.loading = 0;
				userService.setUserId(authData.uid);
			    console.log("Authenticated successfully with payload:", authData);
			    $location.path('/myAccount');
			    $scope.$apply();
			}
		});
	}

	//If a user is already logged in then the user should not be able to login again
	//and is therefore redirected to the myAccount page instead
	$scope.$on('$viewContentLoaded', function() {
        if(userService.getUserId() != null){
            $location.path('/myAccount');
        }
    });

});

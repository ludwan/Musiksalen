musiksalenApp.controller('LoginCtrl', function($scope, userService, $location){

	$scope.login = function() {
		$scope.loading = true;

    	$scope.loginError = false;

		var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");

		ref.authWithPassword({
		  email    : $scope.user,
		  password : $scope.password
		}, function(error, authData) {
			if (error) {
				$scope.loading = false;
			    switch (error.code) {
				    case "INVALID_EMAIL":
				    	$scope.loginError = true;
				    	$scope.errorMessage = "The specified user account email is invalid."
				        break;
				    case "INVALID_PASSWORD":
				    	$scope.loginError = true;
				    	$scope.errorMessage = "The specified user account password is incorrect."
				        break;
				    case "INVALID_USER":
				    	$scope.loginError = true;
				    	$scope.errorMessage = "The specified user account does not exist."
				        break;
				    default:
				    	$scope.loginError = true;
				    	$scope.errorMessage = "Error logging user in:" + error
			    }
			    $scope.$apply();
			} else {
				$scope.loading = false;
				userService.setUserId(authData.uid);
			    console.log("Authenticated successfully with payload:", authData);
			    $location.path('/myAccount');
			    $scope.$apply();
			}
		});
	}

});

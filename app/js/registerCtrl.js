musiksalenApp.controller('RegisterCtrl', function($scope, $location){

	var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");

	$scope.register = function(){
		$scope.loading = true;
		$scope.registerError = false;

		ref.createUser({
		  email    : $scope.email,
		  password : $scope.password
		}, function(error, userData) {
		  	if (error) {
		  		switch (error.code) {
			      	case "EMAIL_TAKEN":
	      				$scope.registerError = true;
	      				$scope.errorMessage = "The new user account cannot be created because the email is already in use.";
				        break;
			     	case "INVALID_EMAIL":
			     		$scope.registerError = true;
      					$scope.errorMessage = "The specified email is not a valid email.";
				        break;
			      	default:
			      		$scope.registerError = true;
			      		$scope.errorMessage = "Error creating user: " + error;
			    }
			    $scope.loading = false;
			    $scope.$apply();

		  	} else {
			    $scope.loading = false;
				$location.path('/login');
			  	$scope.$apply();
		  	}
		});
	}

});

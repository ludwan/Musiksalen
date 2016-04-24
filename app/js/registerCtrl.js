musiksalenApp.controller('RegisterCtrl', function($scope, $location, userService){

	var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");

	//This functions registers a new user via email and password. If invalid
	//credentials are given the proper error message will be shown. If the 
	//credentials are valid then the user will be registred at the backend 
	//and the user will be redirected to the login page.
	$scope.register = function(){
		$scope.loading = true;
		$scope.error = false;

		ref.createUser({
		  email    : $scope.email,
		  password : $scope.password
		}, function(error, userData) {
		  	if (error) {
		  		switch (error.code) {
			      	case "EMAIL_TAKEN":
	      				$scope.error = true;
	      				$scope.errorMessage = "The new user account cannot be created because the email is already in use.";
				        break;
			     	case "INVALID_EMAIL":
			     		$scope.error = true;
      					$scope.errorMessage = "The specified email is not a valid email.";
				        break;
			      	default:
			      		$scope.error = true;
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

	//If a user is already logged in the user should not be able to register a new user
	//and is therefore redirected to the myAccount page instead
	$scope.$on('$viewContentLoaded', function() {
        if(userService.getUserId() != null){
            $location.path('/myAccount');
        }
    });

});

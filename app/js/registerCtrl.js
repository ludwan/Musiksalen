musiksalenApp.controller('RegisterCtrl', function($scope, $location){

	var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");

	$scope.register = function(){
		$scope.loading = true;

		ref.createUser({
		  email    : $scope.email,
		  password : $scope.password
		}, function(error, userData) {
		  if (error) {
		  	//TODO MAKE ERROR WINDOW TELLING THE USER WHAT THE PROBLEM IS
		    console.log("Error creating user:", error);
		    $scope.loading = false;
		    $scope.$apply();

		  } else {
		    console.log("Successfully created user account with uid:", userData.uid);
		    $scope.loading = false;
			$location.path('/login');
		  	$scope.$apply();

		  }
		});
	}

});

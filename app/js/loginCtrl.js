musiksalenApp.controller('LoginCtrl', function($scope){

	$scope.login = function(){
		console.log("We are loging in");
		console.log($scope.user);
		console.log($scope.password);

		$scope.loading = true;
	}

});

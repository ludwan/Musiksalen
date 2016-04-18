musiksalenApp.controller('MyAccountCtrl', function ($scope, userService, $location){

	$scope.logout = function(){
		var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");
		ref.unauth();
		userService.setUserId(null);
		$location.path('/home');
	}

    $scope.$on('$viewContentLoaded', function() {
        console.log("In viewContentLoaded");
        if(userService.getUserId() == null){
            $location.path('/login');
        }
    });
});
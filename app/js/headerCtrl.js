musiksalenApp.controller('HeaderCtrl', function($scope, userService){	

	$scope.loggedIn = function(){
        return (userService.userId != null);
    };
});
musiksalenApp.controller('MyAccountCtrl', function ($scope, $location, userService, firebaseService, echoNestService, lastFmService){

	$scope.logout = function(){
		var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");
		ref.unauth();
		userService.setUserId(null);
		$location.path('/home');
	}

	$scope.getFavoriteArtists = function(){
		$scope.artists = [];
		firebaseService.getFavoriteArtists(userService.getUserId()).then(function (data){
			angular.forEach(data, function(value, key){
				echoNestService.getBasicArtist.get({id : key}, function(data2){
					//console.log(data2);
					var array = {};
					array["id"] = data2.response.artist.id;
					array["name"] = data2.response.artist.name;
					$scope.artists.push(array);
				});
				//$scope.favArtistIds.push(key);
				//console.log($scope.favArtistIds);
			});
			lastFmService.updateArtists($scope.artists);
		});
	}

    $scope.$on('$viewContentLoaded', function() {
        console.log("In viewContentLoaded");
        if(userService.getUserId() == null){
            $location.path('/login');
        }
        $scope.userName = userService.getUserName();
        $scope.getFavoriteArtists();
    });
});
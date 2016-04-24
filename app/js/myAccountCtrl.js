musiksalenApp.controller('MyAccountCtrl', function ($scope, $location, userService, firebaseService, echoNestService, lastFmService){

	$scope.logout = function(){
		var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");
		ref.unauth();
		userService.setUserId(null);
		$location.path('/home');
	}

	$scope.getFavoriteArtists = function() {
		$scope.artists = [];
		firebaseService.getFavoriteArtists(userService.getUserId()).then(function (data){
			angular.forEach(data, function(value, key){
				echoNestService.getBasicArtist.get({id : key}, function(data2){
					var array = {};
					array['id'] = data2.response.artist.id;
					array['name'] = data2.response.artist.name;

					lastFmService.getArtist.get({artist : array['name']}, function(data) {
						array['image'] = data['artist']['image'][2]['#text'];
						$scope.artists.push(array);
					});
				});
			});
		}, function (error){
			$scope.error = true;
			$scope.errorMessage = "There was an error loading user data";
		});
	}

	$scope.getFavoriteSongs = function() {
		$scope.songIds = [];
		firebaseService.getFavoriteSongs(userService.getUserId()).then(function (data){
			angular.forEach(data, function(value, key){
				angular.forEach(value, function(value, key){
					$scope.songIds.push(key);
				})
			});
			echoNestService.getWork.get({id : $scope.songIds}, function (data){
				$scope.songs = data.response.songs;
			}, function (error){
				$scope.error = true;
				$scope.errorMessage = "There was an error loading user data";
			});
		}, function (error){
			$scope.error = true;
			$scope.errorMessage = "There was an error loading user data";
		});
	}

    $scope.$on('$viewContentLoaded', function() {
        if(userService.getUserId() == null){
            $location.path('/login');
        }
        $scope.userName = userService.getUserName();
        $scope.getFavoriteArtists();
        $scope.getFavoriteSongs();
    });
});
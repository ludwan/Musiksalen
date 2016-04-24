musiksalenApp.controller('MyAccountCtrl', function ($scope, $location, userService, firebaseService, echoNestService, lastFmService){

	$scope.sortType     = 'title'; // set the default sort type
  	$scope.sortReverse  = false;

	//This function logs the user out by unauthenticating him or her from the firebase backend
	//and redirects the user to the home page
	$scope.logout = function(){
		var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");
		ref.unauth();
		userService.setUserId(null);
		userService.setUserName(null);
		$location.path('/home');
	}

	//This function retrieves the favorite artists of a particular user by retrieving the users
	//favorites from the backend which consists of artist-ids. The information needed about the
	//artists are then retrieved from the ECHO NEST and LAST-FM APIs. The reason for both is due to
	//ECHO NEST's lack of images and LAST-FM's lack of identifaction. Both api's only allow the
	//retrieval of information for one artist at a time
	$scope.getFavoriteArtists = function() {
		$scope.artists = [];
		firebaseService.getFavoriteArtists(userService.getUserId()).then(function (data){
			angular.forEach(data, function(value, key){
				$scope[key] = true;
				console.log($scope[key]);
				echoNestService.getBasicArtist.get({id : key}, function(data2){
					var array = {};
					array['id'] = data2.response.artist.id;
					array['name'] = data2.response.artist.name;
					console.log(data2.response.artist.id);

					lastFmService.getArtist.get({artist : array['name']}, function(data) {
						array['image'] = data['artist']['image'][2]['#text'];
						$scope.artists.push(array);
					});
				});
			});
            if($scope.artists.length === 0){
                $scope.likeArtists = false;
            } else{
                $scope.likeArtists = true;
            }; 
            
		}, function (error){
			$scope.error = true;
			$scope.errorMessage = "There was an error loading user data";
		});
        
        
	}

	//This function retrieves the favorite songs of a particular user by retrieving the users
	//favorites from the backend which consists of song-ids that are nested within the songs
	//corresponding artist-id. The information needed about the songs are then retrieved from
	//the ECHO NEST API. The information that is needed is the song id and name. As well as the
	//corresponding artists id and name. The API only allows the retrieval of information for 
	//10 songs at a time.
	$scope.getFavoriteSongs = function() {
		$scope.songIds = [];
		$scope.songs = [];
		firebaseService.getFavoriteSongs(userService.getUserId()).then(function (data){
			angular.forEach(data, function(value, key){
				angular.forEach(value, function(value, key){
					$scope.songIds.push(key);
				})
			});
			if($scope.songIds.length == 0){
                $scope.likeSongs = false;
            }else{
                $scope.likeSongs = true;        
            };
			for (var i = 0; i < $scope.songIds.length; i = i + 10) {
				var subArray = $scope.songIds.slice(i, i+10);
				echoNestService.getWork.get({id : subArray}, function (data){
				$scope.songs = $scope.songs.concat(data.response.songs);
                
				}, function (error){
					$scope.error = true;
					$scope.errorMessage = "There was an error loading user data";
				});
			};

			angular.forEach($scope.songIds, function(value, key){
				$scope[value] = true;
			});

		}, function (error){
			$scope.error = true;
			$scope.errorMessage = "There was an error loading user data";
		});
        
	}

	//This function adds the current artist to the user's favorites by using the 
    //firebaseService's function "addFavoriteArtist" and sets the star to be filled
    //in.
	$scope.addFavoriteArtist = function(artistId){
		firebaseService.addFavoriteArtist($scope.uid, artistId);
        $scope[artistId] = true;
	}

	//This function adds the current artist to the user's favorites by using the
    //firebaseService's function "removeFavoriteArtist" and sets the star to be hollow
	$scope.removeFavoriteArtist = function(artistId){
		firebaseService.removeFavoriteArtist($scope.uid, artistId);
        $scope[artistId] = false;
	}

	//This function adds a song to the user's favorites by using the firebaseService's
    //function "addFavoriteSong" and the sets the star to be filled in.
	$scope.addFavoriteSong = function(songId, artistId){
		firebaseService.addFavoriteSong($scope.uid, artistId, songId);
        $scope[songId] = true;
	}

	//This function removes a song from the user's favorites by using the firebaseService's
    //function "removeFavoriteSong" and sets the the star to be hollow
	$scope.removeFavoriteSong = function(songId, artistId){
		firebaseService.removeFavoriteSong($scope.uid, artistId, songId);
        $scope[songId] = false;
	}

	//When the page is loaded the controller will check if an user is actually logged in
	//If not the user is redirected to the login page. Otherwise information about the users
	//favorite artists and songs are retrieved from backend and APIs.
    $scope.$on('$viewContentLoaded', function() {
        if(userService.getUserId() == null){
            $location.path('/login');
        }
        $scope.userName = userService.getUserName();
        $scope.uid = userService.getUserId();
        $scope.getFavoriteArtists();
        $scope.getFavoriteSongs();
    });
});
musiksalenApp.controller('WorksCtrl', function ($scope, $window, $routeParams, youtubeService, echoNestService, userService, firebaseService){

    $scope.loading = 0;
    var uid = userService.getUserId();
    var workId = $routeParams.workId;
	
    //This function is called when the google API needed for youtube is loaded
	$window.initGapi = function() {
        $scope.$apply($scope.loadWork);
    };

    //This function retrieves information about the work. More specifically the
    //works name and name of the artist as well as artist-id. This is done via the
    //echoNestService's resource "getWork". When the call is successfull more info is
    //retrieved. 
    $scope.loadWork = function() {
        $scope.loading++;
        echoNestService.getWork.get({id : workId}, function(data){
            $scope.artistId = data.response.songs[0].artist_id;
            $scope.artistName = data.response.songs[0].artist_name;
            $scope.workTitle = data.response.songs[0].title;
            var keyWord = $scope.artistName + " " + $scope.workTitle;

            $scope.getVideos(keyWord);
            $scope.checkFavorite();
            $scope.loading--;
        }, function (error) {
            $scope.loading--;
            $scope.error = true;
            $scope.errorMessage = "There was an error loading work data";
        });
    }

    //This function retrieves the videos from youtube related to the work. This is done
    //via the youtubeService's function "worksSearch". The function will in turn create a player
    //and retrieve the first video's full description via youtubeService's functions "createPlayer"
    //and getFullDescription.
    $scope.getVideos = function (keyWord) {
        $scope.loading++;
        youtubeService.worksSearch(keyWord, 13).then(function (data) {
            $scope.channel = data.items;
            youtubeService.createPlayer($scope.player,$scope.channel[0].id.videoId);
            $scope.getFullDescription($scope.channel[0].id.videoId);
            $scope[$scope.channel[0].id.videoId] = true;
            $scope.loading--;
        }, function (error) {
            $scope.loading--;
            $scope.error = true;
            $scope.errorMessage = "There was an error loading videos";
        });
    };

    //This function changes the currently playing video to a new one.
    //It also hides the new video among 'Additional videos' and displays the old one
    $scope.changeVideo = function (videoId){
    	var currId = $scope.player.getVideoData()['video_id'];

        $scope.getFullDescription(videoId);
  		$scope[currId] = false;
  		$scope[videoId] = true;  	
    	$scope.player.cueVideoById(videoId, 0, 'large');      
    }

    //This function is used to check wether that specific video should be hidden
    //or not among the 'Additional videos'.
    $scope.isTrue = function (videoId) {
    	if($scope[videoId] == undefined || $scope[videoId] == false) {
    		return false;
    	} else {
    		return true;
    	}
    }

    //This function is used to get the full description of the currently selected
    //video. This is done with the help of youtubeService's 'getFullDescription' function
    $scope.getFullDescription = function (videoId) {
        $scope.loading++;
        youtubeService.getFullDescription(videoId).then(function (data) {
        $scope.videoDescription = data.items[0].snippet.description;
        $scope.loading--;
        }, function (error){
            $scope.loading--;
            $scope.error = true;
            $scope.errorMessage = "There was an error loading video description";
        });
    }

    //This function is used to check wether the current work is in the user's favorites. This is used
    //with the help of the firebaseServices 'checkFavoriteSong' function. $scope.favorited is set 
    //to true or false depending on the answer from "checkFavoriteSong"
    $scope.checkFavorite = function(){
        $scope.loading++;
        firebaseService.checkFavoriteSong(uid, $scope.artistId, workId).then(function (data) {
            if(data == null){
                $scope.favorited = false;
            } else {
                $scope.favorited = true;
            }
            $scope.loading--;
        }, function (error){
            $scope.loading--;
            $scope.error = true;
            $scope.errorMessage = "There was an error loading user data";
        });
    }

    //This function adds the current work to the user's favorites by using the 
    //firebaseService's function "addFavoriteSong and sets the star to be filled
    //in. If a user is not logged in an error message will be displayed instead
    $scope.addFavorite = function() {
        if(uid === null){
            $scope.error = true;
            $scope.errorMessage = "You have to login in order to favorite a work";
        } else {
            firebaseService.addFavoriteSong(uid, $scope.artistId, workId);
            $scope.favorited = true;
        }
    }

    //This function adds the current work to the user's favorites by using the
    //firebaseService's function "removeFavoriteSong" and sets the star to be hollow
    $scope.removeFavorite = function() {
        firebaseService.removeFavoriteSong(uid, $scope.artistId, workId);
        $scope.favorited = false;
    }

    //If gapi.client is not already loaded the function 'loadwork' will be called by function
    //'initGapi' instead
    $scope.$on('$viewContentLoaded', function() {
        if(gapi.client != undefined){
            $scope.loadWork();
        }
    });   

});
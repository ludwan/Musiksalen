'use strict';
var tag = document.createElement('script');
var firstScriptTag = document.getElementsByTagName('script')[0];

tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

musiksalenApp.controller('WorksCtrl', function ($scope, $window, $routeParams, youtubeService, echoNestService, lastFmService, userService, firebaseService){

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

    $scope.changeVideo = function (videoId){
    	var currId = $scope.player.getVideoData()['video_id'];

        $scope.getFullDescription(videoId);
  		$scope[currId] = false;
  		$scope[videoId] = true;  	
    	$scope.player.cueVideoById(videoId, 0, 'large');      
    }

    $scope.isTrue = function (videoId) {
    	if($scope[videoId] == undefined || $scope[videoId] == false) {
    		return false;
    	} else {
    		return true;
    	}
    }

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

    $scope.addFavorite = function() {
        if(uid === null){
            $scope.error = true;
            $scope.errorMessage = "You have to login in order to favorite a work";
        } else {
            firebaseService.addFavoriteSong(uid, $scope.artistId, workId);
            $scope.favorited = true;
        }
    }

    $scope.removeFavorite = function() {
        firebaseService.removeFavoriteSong(uid, $scope.artistId, workId);
        $scope.favorited = false;
    }

    $scope.$on('$viewContentLoaded', function() {
        console.log("In viewContentLoaded");
        if(gapi.client != undefined){
            $scope.loadWork();
        }
    });   

});
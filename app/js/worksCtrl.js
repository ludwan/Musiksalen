'use strict';
var tag = document.createElement('script');
var firstScriptTag = document.getElementsByTagName('script')[0];

tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

musiksalenApp.controller('WorksCtrl', function ($scope, $window, $routeParams, youtubeService, echoNestService){
	console.log("In WorksCtrl");
	
	$window.initGapi = function() {
		console.log("In initGapi");
        $scope.$apply($scope.loadWork);
    };

    $scope.loadWork = function() {
        console.log("in loadWork");
        var workId = $routeParams.workId;

        echoNestService.getWork.get({id : workId}, function(data){
            console.log(data);
            $scope.artistName = data.response.songs[0].artist_name;
            $scope.workTitle = data.response.songs[0].title;
            var keyWord = $scope.artistName + " " + $scope.workTitle;
            $scope.getVideos(keyWord);
        }, function (error) {
            console.log("EchoNest get work failed: " + error);
        });
    }

    $scope.getVideos = function (keyWord) {
    	console.log("In getVideos");
        youtubeService.worksSearch(keyWord).then(function (data) {
            $scope.channel = data.items;
            console.log($scope.channel);
            $scope.createPlayer($scope.channel[0].id.videoId);
        }, function (error) {
            console.log('Failed: ' + error)
        });
    };

    $scope.createPlayer = function (videoId) {
    	console.log("In createPlayer");
        $scope.getFullDescription(videoId);
    	$scope[videoId] = true;
    	$scope.player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: videoId
        });
    }

    $scope.changeVideo = function (videoId){
    	var currId = $scope.player.getVideoData()['video_id'];

    	console.log("In changeVideo");
        $scope.getFullDescription(videoId);
  		$scope[currId] = false;
  		$scope[videoId] = true;  	
    	$scope.player.cueVideoById(videoId, 0, 'large');      
    }

    $scope.isTrue = function (videoId) {
    	console.log("In isTrue");
    	if($scope[videoId] == undefined || $scope[videoId] == false) {
    		return false;
    	} else {
    		return true;
    	}
    }

    $scope.getFullDescription = function (videoId) {
        console.log("In getFullDescription");
        youtubeService.getFullDescription(videoId).then(function (data) {
        $scope.videoDescription = data.items[0].snippet.description;
        }, function (error){
            console.log('description failed: ' + error);
        });
    }

    $scope.$on('$viewContentLoaded', function() {
        console.log("In viewContentLoaded");
        if(gapi.client != undefined){
            $scope.loadWork();
        }
    });   

});
'use strict';
var tag = document.createElement('script');
var firstScriptTag = document.getElementsByTagName('script')[0];

tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

musiksalenApp.controller('WorksCtrl', function ($scope, $window, $routeParams, youtubeService){
	console.log("In WorksCtrl");
    var keyWord = "Moonlight Sonata"
	
	$window.initGapi = function() {
		console.log("In initGapi");
        $scope.$apply($scope.getVideos);
    };

    $scope.loadWork = function() {
        var workId = $routeParams.workId;
        console.log(workId);
    }

    $scope.getVideos = function () {
    	console.log("In getVideos");
        $scope.loadWork();
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
            $scope.getVideos();
        }
    });   

});
musiksalenApp.controller('SingleArtistCtrl', function ($scope, $routeParams, $filter, echoNestService, lastFmService, userService, youtubeService){
    

    $scope.ArtistId = $routeParams.artistId;
    $scope.bio = "Not available";
    $scope.activeYears = "Not available";
    $scope.loading = 1;
    var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com/favoriteArtists");
    var songRef = new Firebase("https://sweltering-inferno-7067.firebaseio.com/favoriteSongs");
    var uid = userService.getUserId();
    
    echoNestService.getArtist.get({id : $scope.ArtistId, bucket :"artist_location"}, function(data){
        var artist = data.response.artist;
        console.log(artist);

        $scope.getArtistInfo(artist.name);
        
        var keyWord = artist.name + "documentary";
        $scope.getVideos(keyWord);
        console.log(keyWord);
        
        $scope.artistlocation = artist.artist_location.country;

        //$scope.getWorksViaArtistId(artist.id);
        $scope.getWorksViaPlaylistId(artist.id);
        //$scope.getWorksViaSearchId(artist.id);

        $scope.genres = artist.genres;
        if(artist.years_active.length != 0){

            $scope.activeYears = artist.years_active[0].start + " - " + artist.years_active[0].end;
        }
        $scope.loading--;
    });

    $scope.getWorksViaArtistId = function(artistId) {
        echoNestService.getArtistWorks.get({id: artistId}, function(data){
            $scope.works = data.response.songs;
            //console.log(data);
        })
    }
   
    $scope.getWorksViaPlaylistId = function(artistId){
        $scope.loading++;
        echoNestService.workPlaylistSearch.get({artist_id : artistId}, function(data){
            $scope.works = data.response.songs;
            $scope.loading--;
        });
    }

    $scope.getWorksViaSearchId = function(artistId){
        echoNestService.workSearch.get({artist_id : artistId}, function(data){
            $scope.works = data.response.songs;
            //console.log(data);
        });
    }
    
    $scope.getArtistInfo = function(artistName) {
        $scope.loading++;
        lastFmService.getArtist.get({artist: artistName}, function(data){
            $scope.singleArtist = data.artist;
            $scope.artistName = data.artist.name;
            $scope.bio = $scope.singleArtist.bio.content;
            $scope.singleArtist.image = data['artist']['image'][4]['#text'];
            console.log($scope.singleArtist);
            $scope.loading--;
  
        });
        
    }

    $scope.checkFavorite = function(){
        var string = uid + "/" + $scope.ArtistId;
        var favoriteRef = ref.child(string);

        favoriteRef.on("value", function(snapshot) {
            if(snapshot.val() == null){
                $scope.favorited = false;
            } else {
                $scope.favorited = true;
            }
            $scope.$evalAsync();
        }, function (errorObject) {
            //TODO some proper error handling with windows etc
            console.log("The read failed: " + errorObject.code);
        });
    };

    var onComplete = function(error) {
        //TODO some proper error handling with windows etc instead
        if (error) {
            console.log('Synchronization failed');
        } else {
            console.log('Synchronization succeeded');
        }
    };

    $scope.addFavorite = function() {
        if(uid === null){
            $scope.favoriteError = true;
        } else {
            var array = {};
            array[$scope.ArtistId] = true;

            var userRef = ref.child(uid);
            userRef.update(array, onComplete);
            $scope.favorited = true;
        }
    }

    $scope.removeFavorite = function() {
        var string = uid + "/" + $scope.ArtistId;

        var favoriteRef = ref.child(string);
        favoriteRef.remove(onComplete);
        $scope.favorited = false;
    }

    $scope.checkFavoriteSongs = function() {
        var string = uid + "/" + $scope.ArtistId;
        var favoriteSongRef = songRef.child(string);

        favoriteSongRef.on("value", function(snapshot) {
            if(snapshot.val() == null){
                console.log("Nothing here");
            } else {
                angular.forEach(snapshot.val(), function(value, key){
                    $scope[key] = value;
                });
            }
            //$scope.$apply();
        }, function (errorObject) {
            //TODO some proper error handling with windows etc
            console.log("The read failed: " + errorObject.code);
        });
    }

    $scope.addFavoriteSong = function(workId) {
        console.log(workId);
        if(uid === null){
            $scope.favoriteError = true;
        } else {
            var array = {};
            array[workId] = true;
            var string = uid + "/" + $scope.ArtistId;

            var userRef = songRef.child(string);
            userRef.update(array, onComplete);
            $scope[workId] = true;
        }
    }

    $scope.removeFavoriteSong = function(workId) {
        var string = uid + "/" + $scope.ArtistId +"/"+ workId;
        console.log(string);
        var favoriteRef = songRef.child(string);
        favoriteRef.remove(onComplete);
        $scope[workId] = false;
    }


    $scope.$on('$viewContentLoaded', function() {
        $scope.checkFavoriteSongs();
        $scope.checkFavorite();
    });
    
    //documentary
//    $window.initGapi = function() {
//        $scope.$apply($scope.loadWork);
//    };

   

    $scope.getVideos = function (keyWord) {
        $scope.loading++;
        youtubeService.worksSearch(keyWord).then(function (data) {
            $scope.channel = data.items;
            console.log($scope.channel);
            $scope.createPlayer($scope.channel[0].id.videoId);
        }, function (error) {
            console.log('Failed: ' + error)
        });
    };

    $scope.createPlayer = function (videoId) {
        
    	$scope[videoId] = true;
    	$scope.player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: videoId
        });
        $scope.loading--;
    }

    $scope.changeVideo = function (videoId){
    	var currId = $scope.player.getVideoData()['video_id'];

        $scope.getFullDescription(videoId);
  		$scope[currId] = false;
  		$scope[videoId] = true;  	
    	$scope.player.cueVideoById(videoId, 0, 'large');      
    }

    
});
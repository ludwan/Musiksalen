musiksalenApp.controller('SingleArtistCtrl', function ($scope, $routeParams, $filter, echoNestService, lastFmService, userService, youtubeService, firebaseService){

    

    $scope.ArtistId = $routeParams.artistId;
    $scope.bio = "Not available";
    $scope.activeYears = "Not available";
    $scope.loading = 0;
    var uid = userService.getUserId();
    

    echoNestService.getArtist.get({id : $scope.ArtistId, bucket :"artist_location"}, function(data){
        $scope.loading++;
        var artist = data.response.artist;
        

        //$scope.getArtistInfo(artist.name);
        
        var keyWord = artist.name + "documentary";
        $scope.getVideos(keyWord);
        console.log(keyWord);
        
        $scope.artistlocation = artist.artist_location.country;
        
        $scope.genres = artist.genres;

        $scope.getArtistInfo(artist.name);      
        $scope.getDocumentary(keyWord);



        $scope.getWorksViaPlaylistId(artist.id);

        if(artist.years_active.length != 0){
            $scope.activeYears = artist.years_active[0].start + " - " + artist.years_active[0].end;
        }
        $scope.loading--;
    }, function (error) {
            console.log(error);
            $scope.favoriteError = true;
            console.log($scope.favoriteError);
            console.log($scope.loading);
            $scope.errorMessage = "There was an error loading artist info";
    });
   
    $scope.getWorksViaPlaylistId = function(artistId){
        $scope.loading++;
        echoNestService.workPlaylistSearch.get({artist_id : artistId}, function(data){
            $scope.works = data.response.songs;
            $scope.loading--;
        }, function (error) {
            $scope.favoriteError = true;
            $scope.errorMessage = "There was an error loading artist info";
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
  
        }, function (error) {
            $scope.favoriteError = true;
            $scope.errorMessage = "There was an error loading artist info";
        });       
    }

    $scope.checkFavorite = function(){
        firebaseService.checkFavoriteArtist(uid, $scope.ArtistId).then(function (data) {
            if(data != null){
                $scope.favorited = true;
            } else {
                $scope.favorited = false; 
            }
        }, function (error){
            $scope.favoriteError = true;
            $scope.errorMessage = "There was an error loading user data";
        });
    }

    $scope.checkFavoriteSongs = function(){
        firebaseService.checkFavoriteSong(uid, $scope.ArtistId).then(function (data) {
            if(data != null){
                angular.forEach(data, function(value, key){
                    $scope[key] = value;
                });
            }
        }, function (error){
            $scope.favoriteError = true;
            $scope.errorMessage = "There was an error loading user data";
        });
    }

    $scope.addFavorite = function() {
        if(uid === null){
            $scope.favoriteError = true;
            $scope.errorMessage = "You have to login in order to favorite an artist";
        } else {
            firebaseService.addFavoriteArtist(uid, $scope.ArtistId);
            $scope.favorited = true;
        }
    }

    $scope.removeFavorite = function() {
        firebaseService.removeFavoriteArtist(uid, $scope.ArtistId);
        $scope.favorited = false;
    }

    $scope.addFavoriteSong = function(workId) {
        if(uid === null){
            $scope.favoriteError = true;
            $scope.errorMessage = "You have to login in order to favorite a work"
        } else {
            firebaseService.addFavoriteSong(uid, $scope.ArtistId, workId);
            $scope[workId] = true;
        }
    }

    $scope.removeFavoriteSong = function(workId) {
        firebaseService.removeFavoriteSong(uid, $scope.ArtistId, workId);
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

    $scope.getDocumentary = function (keyWord) {
        $scope.loading++;
        youtubeService.worksSearch(keyWord,1).then(function (data) {
            var channel = data.items;
            youtubeService.createPlayer($scope.player, channel[0].id.videoId);
            $scope.loading--;
        }, function (error) {
            $scope.favoriteError = true;
            $scope.errorMessage = "There was an error loading Youtube data";
        });
    };
  
});
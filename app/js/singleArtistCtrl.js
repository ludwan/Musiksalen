musiksalenApp.controller('SingleArtistCtrl', function ($scope, $routeParams, $filter, echoNestService, lastFmService, userService, youtubeService, firebaseService, $location, $anchorScroll){

    

    $scope.ArtistId = $routeParams.artistId;
    $scope.bio = "Not available";
    $scope.activeYears = "Not available";
    $scope.loading = 1;
    var uid = userService.getUserId();
    
    //This is the initial API call to ECHO NEST that is called when the page is loaded. The specific
    //information gathered here are artist location, genres and active years. This info is not available
    //in the LAST FM API. This part will, if successful call for the other types of information to be
    //retrieved. 
    echoNestService.getArtist.get({id : $scope.ArtistId, bucket :"artist_location"}, function(data){
        var artist = data.response.artist;        
        var keyWord = artist.name + " documentary";

        
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
            $scope.error = true;
            console.log($scope.error);
            console.log($scope.loading);
            $scope.errorMessage = "There was an error loading artist info";
    });
   
    //This function retrieves songs related to that artist from the ECHO NEST API. This can not
    //be retrieved from LAST FM due to the fact that LAST FM lacks proper identification on their songs.
    //Thefunction uses the echoNestService's "workPlaylistSearch" resource to find songs. This specific
    //one is used since it does not return duplicates. 
    $scope.getWorksViaPlaylistId = function(artistId){
        $scope.loading++;
        echoNestService.workPlaylistSearch.get({artist_id : artistId}, function(data){
            $scope.works = data.response.songs;
            $scope.loading--;
        }, function (error) {
            $scope.error = true;
            $scope.errorMessage = "There was an error loading artist info";
        });
    }
    
    //This function retrieves information about the artist from the LAST-FM api using
    //the lastFmService "getArtist" resource. The specific parts taken from LAST-FM are
    //artist bio, image and name. Artist bio and image are not retrievable via the ECHO-NEST
    //due to the majority of that specific information being broken
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
            $scope.error = true;
            $scope.errorMessage = "There was an error loading artist info";
        });       
    }

    //This function retrieves if the user has favorited the artist by using the
    //firebaseService's function "checkFavoriteArtist". $scope.favorited is set 
    //to true or false depending on the answer from "checkFavoriteArtist"
    $scope.checkFavorite = function(){
        firebaseService.checkFavoriteArtist(uid, $scope.ArtistId).then(function (data) {
            if(data != null){
                $scope.favorited = true;
            } else {
                $scope.favorited = false; 
            }
        }, function (error){
            $scope.error = true;
            $scope.errorMessage = "There was an error loading user data";
        });
    }

    //This functions retrieves which of the artist's songs are currently favorited by 
    //the current user. This is done by using the firebaseService's function 
    //"checkFavoriteSong" and setting the id's of those songs to true. In order
    //to fill in the proper stars.
    $scope.checkFavoriteSongs = function(){
        firebaseService.checkFavoriteSong(uid, $scope.ArtistId).then(function (data) {
            if(data != null){
                angular.forEach(data, function(value, key){
                    $scope[key] = value;
                });
            }
        }, function (error){
            $scope.error = true;
            $scope.errorMessage = "There was an error loading user data";
        });
    }

    //This function adds the current artist to the user's favorites by using the 
    //firebaseService's function "addFavoriteArtist" and sets the star to be filled
    //in. If a user is not logged in an error message will be displayed instead
    $scope.addFavorite = function() {
        if(uid === null){
            $scope.error = true;
            $scope.errorMessage = "You have to login in order to favorite an artist";
        } else {
            firebaseService.addFavoriteArtist(uid, $scope.ArtistId);
            $scope.favorited = true;
        }
    }

    //This function adds the current artist to the user's favorites by using the
    //firebaseService's function "removeFavoriteArtist" and sets the star to be hollow
    $scope.removeFavorite = function() {
        firebaseService.removeFavoriteArtist(uid, $scope.ArtistId);
        $scope.favorited = false;
    }

    //This function adds a song to the user's favorites by using the firebaseService's
    //function "addFavoriteSong" and the sets the star to be filled in. If a user is not
    //logged in an error message will be displayed instead.
    $scope.addFavoriteSong = function(workId) {
        if(uid === null){
            $scope.error = true;
            $location.hash('top');
            $anchorScroll();
            $scope.errorMessage = "You have to login in order to favorite a work"
        } else {
            firebaseService.addFavoriteSong(uid, $scope.ArtistId, workId);
            $scope[workId] = true;
        }
    }

    //This function removes a song from the user's favorites by using the firebaseService's
    //function "removeFavoriteSong" and sets the the star to be hollow
    $scope.removeFavoriteSong = function(workId) {
        firebaseService.removeFavoriteSong(uid, $scope.ArtistId, workId);
        $scope[workId] = false;
    }

    $scope.$on('$viewContentLoaded', function() {
        $scope.checkFavoriteSongs();
        $scope.checkFavorite();
    });
      
    //This function retrieves a documentary related to the artist via youtube. This is done 
    //by using the youtubeService's function "worksSearch" and if that is succesfull the 
    //youtubeService's function "createPlayer"
    $scope.getDocumentary = function (keyWord) {
        $scope.loading++;
        youtubeService.worksSearch(keyWord,1).then(function (data) {
            var channel = data.items;
            youtubeService.createPlayer($scope.player, channel[0].id.videoId);
            $scope.loading--;
        }, function (error) {
            $scope.error = true;
            $scope.errorMessage = "There was an error loading Youtube data";
        });
    };
  
});
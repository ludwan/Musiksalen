musiksalenApp.controller('SingleArtistCtrl', function ($scope, $routeParams, $filter, echoNestService, lastFmService, userService){
    

    $scope.ArtistId = $routeParams.artistId;
    $scope.bio = "Not available";
    $scope.activeYears = "Not available";
    $scope.loading = 1;
    var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com/favoriteArtists");
    var uid = userService.getUserId();
    
    echoNestService.getArtist.get({id : $scope.ArtistId}, function(data){
        var artist = data.response.artist;
        //console.log(artist);

        $scope.getArtistInfo(artist.name);

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
        }, function (errorObject) {
            //TODO some proper error handling with windows etc
            console.log("The read failed: " + errorObject.code);
        });
    };

    $scope.checkFavorite();

    var onComplete = function(error) {
        //TODO some proper error handling with windows etc instead
        if (error) {
            console.log('Synchronization failed');
        } else {
            console.log('Synchronization succeeded');
        }
    };

    $scope.addFavorite = function() {
        //TODO Error message or something if not logged in
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

    
});
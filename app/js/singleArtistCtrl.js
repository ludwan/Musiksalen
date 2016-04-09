musiksalenApp.controller('SingleArtistCtrl', function($scope, $routeParams, $filter, echoNestService, lastFmService){
    

    $scope.ArtistId = $routeParams.artistId;
    $scope.bio = "Not available";
    $scope.activeYears = "Not available";
    
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
    });

    $scope.getWorksViaArtistId = function(artistId) {
        echoNestService.getArtistWorks.get({id: artistId}, function(data){
            $scope.works = data.response.songs;
            //console.log(data);
        })
    }
   
    $scope.getWorksViaPlaylistId = function(artistId){
        echoNestService.workPlaylistSearch.get({artist_id : artistId}, function(data){
            $scope.works = data.response.songs;
            console.log(data);
        });
    }

    $scope.getWorksViaSearchId = function(artistId){
        echoNestService.workSearch.get({artist_id : artistId}, function(data){
            $scope.works = data.response.songs;
            //console.log(data);
        });
    }
    
    $scope.getArtistInfo = function(artistName) {
        lastFmService.getArtist.get({artist: artistName}, function(data){
            $scope.singleArtist = data.artist;
            $scope.artistName = data.artist.name;
            $scope.bio = $scope.singleArtist.bio.content;
            $scope.singleArtist.image = data['artist']['image'][4]['#text'];
        });
    }
});
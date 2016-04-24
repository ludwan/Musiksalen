musiksalenApp.controller('HomeCtrl', function ($scope, echoNestService, lastFmService, $q){  

    //This functions returns the top artists relatoed to a specific genre and time period
    $scope.getTopArtists = function(selectedGenre, startYear, endYear){
        var deferred = $q.defer();
        var list;
        echoNestService.ArtistSearch.get({genre : selectedGenre ,artist_start_year_after : startYear, artist_end_year_before : endYear, results :5},function(data){
            list = data.response.artists;
            lastFmService.updateArtists(list);
            deferred.resolve(list);
        }, function(error){
            deferred.reject(error);
        });

        return deferred.promise;
    }
    //    Medieval     
    $scope.medievalArtists = [{"id":"ARUXZG81187FB5ACA0","name":"Hildegard von Bingen"}, {"id":"ARFHCDF1187FB5AB93","name":"Léonin"}, {"id":"ARZZ6AV1187FB412D9","name":"Pérotin"}, {"id":"AR2JVUX1187FB5CEF5","name":"Guillaume de Machaut"},{"id":"AR9JUVH1187FB4019E", "name":"Guillaume Dufay"}];
    lastFmService.updateArtists($scope.medievalArtists);
    //    RENAISSANCE
    $scope.getTopArtists('renaissance', 1400, 1600).then(function (data){
        $scope.renaissanceArtists = data;
    }, function(error){
        $scope.error = true;
        $scope.errorMessage = "Error: Could not load top renaissance artists";
    });
    //    Baroque
    $scope.getTopArtists('baroque').then(function (data){
        $scope.baroqueArtists = data;
    }, function(error){
        $scope.error = true;
        $scope.errorMessage = "Error: Could not load top baroque artists";
    });

    //  Classical
    $scope.getTopArtists('classical period').then(function (data){
        $scope.classicalArtists = data;
    }, function(error){
        $scope.error = true;
        $scope.errorMessage = "Error: Could not load top classical period artists";
    });

    //    Romantic
    $scope.getTopArtists('romantic', 1815, 1910).then(function (data){ 
        $scope.romanArtists = data;
    }, function(error){
        $scope.error = true;
        $scope.errorMessage = "Error: Could not load top romantic artists";
    });

    //    20 century
    $scope.getTopArtists('modern classical', 1900, 2000).then(function (data){
        $scope.twentyArtists = data;
    }, function(error){
        $scope.error = true;
        $scope.errorMessage = "Error: Could not load top modern classical artists";
    });
    
});
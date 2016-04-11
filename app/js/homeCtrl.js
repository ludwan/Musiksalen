musiksalenApp.controller('HomeCtrl', function ($scope, echoNestService, lastFmService, $q){
    
    echoNestService.ArtistSearch.get({genre : 'classical', min_familiarity : 0.65},function(data){
       
        $scope.topArtists = data.response.artists;
        // console.log($scope.topArtists);
    });
    //XU: Too many repeat in the code, try to use the value of section...    

    $scope.getTopArtists = function(selectedGenre, startYear, endYear){
        var deferred = $q.defer();
        var list;
        echoNestService.ArtistSearch.get({genre : selectedGenre ,artist_start_year_after : startYear, artist_end_year_before : endYear, results : 4},function(data){
            list = data.response.artists;
            lastFmService.updateArtists(list);
            deferred.resolve(list);
        });

        return deferred.promise;
    }
    //Ludwig: Fixed some of the code repeat
    //    Medieval     
    $scope.medievalArtists = [{"id":"ARUXZG81187FB5ACA0","name":"Hildegard von Bingen"}, {"id":"ARFHCDF1187FB5AB93","name":"Léonin"}, {"id":"ARZZ6AV1187FB412D9","name":"Pérotin"}, {"id":"AR2JVUX1187FB5CEF5","name":"Guillaume de Machaut"}];
    //$scope.getArtistInfo($scope.medievalArtists);
    lastFmService.updateArtists($scope.medievalArtists);
    //    RENAISSANCE
    $scope.getTopArtists('renaissance', 1400, 1600).then(function (data){   //Ludwig: i changed 'classical' to 'renaissance' and is it necessary with the years?
        $scope.renaissanceArtists = data;
    });
    //    Baroque
    $scope.getTopArtists('baroque').then(function (data){
        $scope.baroqueArtists = data;
    });
    //  Classical
    $scope.getTopArtists('classical period').then(function (data){
        $scope.classicalArtists = data;
    });
    //    Romantic
    $scope.getTopArtists('romantic', 1815, 1910).then(function (data){  //Ludwig: i changed 'classical' to 'romantic' and is it necessary with the years?
        $scope.romanArtists = data;
    });
    //    20 century
    $scope.getTopArtists('modern classical', 1900, 2000).then(function (data){  //Ludwig: i changed 'classical' to 'modern classical' and is it necessary with the years?
        $scope.twentyArtists = data;
    });
    
});
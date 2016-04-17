musiksalenApp.controller('SearchCtrl', function($scope, echoNestService, lastFmService){
    
    
    $scope.searchArtists = function(query,$event){
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            console.log("searching!")
            echoNestService.ArtistSearch.get({name : query, fuzzy_match : true, genre : "classical"}, function(data){
                $scope.ResultArtists = data.response.artists;
                
                lastFmService.updateArtists($scope.ResultArtists);
                console.log($scope.ResultArtists);
            });
        };        
    }
    
    
    
})
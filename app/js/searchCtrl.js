musiksalenApp.controller('SearchCtrl', function($scope, echoNestService, lastFmService){
    
    $scope.searchArtists = function(query,$event){
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            console.log("searching!")
            echoNestService.ArtistSearch.get({name : query, fuzzy_match : true}, function(data){
                $scope.searchResultArtists = data.response.artists;
                lastFmService.updateArtists($scope.searchResultArtists);
            });
            
            console.log($scope.searchResultArtists);
        };        
    }
    
    
    
})
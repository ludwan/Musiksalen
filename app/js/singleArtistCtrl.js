musiksalenApp.controller('SingleArtistCtrl', function($scope, $routeParams, echoNestService, $rootScope){
    
    $scope.ArtistId = $routeParams.artistId;
    echoNestService.getArtist.get({id : $scope.ArtistId}, function(data){
        $scope.singleArtist = data.response.artist;
        console.log($scope.singleArtist);
    });
    
})
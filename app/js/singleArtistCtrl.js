musiksalenApp.controller('SingleArtistCtrl', function($scope, $routeParams, echoNestService, lastFmService){
    
    $scope.ArtistId = $routeParams.artistId;
    // echoNestService.getArtist.get({id : $scope.ArtistId}, function(data){
    //     $scope.singleArtist = data.response.artist;
    //     console.log($scope.singleArtist);
    // });

    lastFmService.getArtist.get({mbid : $scope.ArtistId}, function(data){
        $scope.singleArtist = data.artist;
        $scope.singleArtist.image = data['artist']['image'][4]['#text'];
    });

    lastFmService.getWorks.get({mbid : $scope.ArtistId}, function(data){
    	$scope.works = data.toptracks.track;
    });
    
})
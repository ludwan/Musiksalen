musiksalenApp.controller('HomeCtrl', function($scope,  $window, echoNestService, $rootScope){
    
    echoNestService.ArtistSearch.get({genre : 'classical', min_familiarity : 0.65},function(data){
       
        $scope.topArtists = data.response.artists;
        console.log($scope.topArtists);
    });
    
});
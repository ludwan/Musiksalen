musiksalenApp.controller('ArtistsCtrl', function($scope,  $window, echoNestService, lastFmService){
    
    echoNestService.ArtistSearch.get({genre : 'classical'},function(data){
        $scope.artists = data.response.artists;
        console.log(data.response.artists);

        angular.forEach($scope.artists, function(value, key){
            if(value.name != undefined){
                lastFmService.getArtist.get({artist : value.name},function(data){
                    console.log(data);
                    var imgSrc = data['artist']['image'][2]['#text'];
                    // var imgSrcArray = data.artist.image.map(function(image){ return image['#text'] });

                    value.name = data.artist.name;
                    value.image = imgSrc;
                    value.id = data.artist.mbid;
                });
            }
        });
    });
    
    // filter is searching keyword
    // 4.5 finish the filter for artists with period, country
//    $scope.filteredArtists = function(time, country, filter) {
    $scope.filteredArtists = function(time, country) {
        console.log("filteredArtists");
        var start, end;
        start = Number(time.substr(0,4));
        end = Number(time.substr(5,4));
        console.log(start);
        
        echoNestService.ArtistSearch.get({genre : 'classical',artist_start_year_after : start, artist_end_year_before : end, artist_location : country},function(data){
            $scope.artists = data.response.artists;
            console.log(data.response.artists);
        });
        
        echoNestService.ArtistSearch.get({genre : 'classical',artist_start_year_before : start, artist_end_year_after : start, artist_location : country},function(data){
            $scope.artists = $scope.artists.concat(data.response.artists) ;
        });
        
        echoNestService.ArtistSearch.get({genre : 'classical',artist_start_year_before : end, artist_end_year_after : end, artist_location : country},function(data){
            $scope.artists = $scope.artists.concat(data.response.artists) ;
            console.log($scope.artists);
        });
        
    }
    
});
// .directive('checkImage', function($http) {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             attrs.$observe('ngSrc', function(ngSrc) {
//                 $http.get(ngSrc).success(function(){
//                     //alert('image exist');
//                 }).error(function(){
//                     //alert('image not exist');
//                     element.attr('src', 'http://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg'); // set default image
//                 });
//             });
//         }
//     };
// });


musiksalenApp.controller('ArtistsCtrl', function($scope,  $window, echoNestService, lastFmService){
    
    echoNestService.ArtistSearch.get({genre : 'classical'},function(data){
        $scope.artists = data.response.artists;

        angular.forEach($scope.artists, function(value, key){
            if(value.name != undefined){
                lastFmService.getArtist.get({artist : value.name},function(data){
                   // console.log(data);
                    var imgSrc = data['artist']['image'][2]['#text'];
                    // var imgSrcArray = data.artist.image.map(function(image){ return image['#text'] });

                    value.finalName = data.artist.name;
                    value.image = imgSrc;
                    value.mbid = data.artist.mbid;
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
        console.log(end);
        
        var arts = [];
            angular.forEach(echoNestService.medievalArtists, function(value, key){
            if(value!= undefined){
                
                echoNestService.getArtist.get({id : value.id},function(data){
                   
                    arts.push(data.response.artist);
                    
                    
                }); 
                $scope.artists = arts;
            }
        });
        
        if(start===476){
  
            angular.forEach($scope.artists, function(value, key){
                if(value.name != undefined){
                    lastFmService.getArtist.get({artist : value.name},function(data){
                        console.log(data);
                        var imgSrc = data['artist']['image'][2]['#text'];
                        // var imgSrcArray = data.artist.image.map(function(image){ return image['#text'] });

                        value.finalName = data.artist.name;
                        value.image = imgSrc;
                        value.mbid = data.artist.mbid;
                    });
                }
            });
        console.log($scope.artists);
            
        }else{
        
        echoNestService.ArtistSearch.get({genre : 'classical',artist_start_year_after : start, artist_end_year_before : end, artist_location : country},function(data){
            console.log(data);
            $scope.artists = data.response.artists;
            console.log(data.response.artists);
            angular.forEach($scope.artists, function(value, key){
                if(value.name != undefined){
                    lastFmService.getArtist.get({artist : value.name},function(data){
                        console.log(data);
                        var imgSrc = data['artist']['image'][2]['#text'];
                        // var imgSrcArray = data.artist.image.map(function(image){ return image['#text'] });

                        value.finalName = data.artist.name;
                        value.image = imgSrc;
                        value.mbid = data.artist.mbid;
                    });
                }
            });
        });
        // echoNestService.ArtistSearch.get({genre : 'classical',artist_start_year_before : start, artist_end_year_after : start, artist_location : country},function(data){
        //     $scope.artists = $scope.artists.concat(data.response.artists) ;
        // });
        //
        // echoNestService.ArtistSearch.get({genre : 'classical',artist_start_year_before : end, artist_end_year_after : end, artist_location : country},function(data){
        //     $scope.artists = $scope.artists.concat(data.response.artists) ;
        //     console.log($scope.artists);
        // 
        //             
        //});
        };
    
    };
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


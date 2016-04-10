musiksalenApp.controller('ArtistsCtrl', function($scope,  $window, echoNestService, lastFmService){
    $scope.genre = "hello";

    $scope.typeOptionsPeriod = [
        { name: 'All periods', value: 'classical' }, 
        { name: 'Medieval (476–1400)', value: 'early music' }, 
        { name: 'Renaissance (1400–1600)', value: 'renaissance' },
        { name: 'Baroque (1600–1760)', value: 'baroque' },
        { name: 'Classical period (1730–1820)', value: 'classical period' },
        { name: 'Romantic period (1815–1910)', value: '1815-1910' },
        { name: '20th century (1900–2000)', value: '1900-2000' }
    ];

    $scope.genre = $scope.typeOptionsPeriod[0].value;

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

    $scope.updateArtists = function() {
        angular.forEach($scope.artists, function(value, key){
            if(value.name != undefined){
                lastFmService.getArtist.get({artist : value.name},function(data){
                    //console.log(data);
                    var imgSrc = data['artist']['image'][2]['#text'];

                    value.finalName = data.artist.name;
                    value.image = imgSrc;
                    value.mbid = data.artist.mbid;
                });
            }
        });
    }
    
// filter is searching keyword
// 4.5 finish the filter for artists with period, country

    $scope.filteredArtists = function(genre, country) {
        console.log("filteredArtists");

        if(genre=="1815-1910" || genre=="1900-2000"){
            var start, end;
            start = Number(genre.substr(0,4));
            end = Number(genre.substr(5,4));
            
            echoNestService.ArtistSearch.get({genre : "classical", artist_start_year_after : start, artist_end_year_before : end, artist_location : country},function(data){
                console.log(data);
                $scope.artists = data.response.artists;
                console.log(data.response.artists);
                $scope.updateArtists();
            });
        } else if(genre==="classical"){
            echoNestService.ArtistSearch.get({genre : "classical", artist_location : country},function(data){
                console.log(data);
                $scope.artists = data.response.artists;
                console.log(data.response.artists);
                $scope.updateArtists();
            });
        } else if(genre==="early music"){
            echoNestService.ArtistSearch.get({genre : "early music", artist_start_year_after : 476, artist_end_year_before : 1400, artist_location : country},function(data){
                console.log(data);
                $scope.artists = data.response.artists;
                console.log(data.response.artists);
                $scope.updateArtists();
            });
        }else{
            echoNestService.ArtistSearch.get({genre : genre, artist_location : country, artist_end_year_before:2000},function(data){
                console.log(data);
                $scope.artists = data.response.artists;
                console.log(data.response.artists);
                $scope.updateArtists();
            });
        }
    };

    this.countryList = [];

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


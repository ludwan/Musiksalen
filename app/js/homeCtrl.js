musiksalenApp.controller('HomeCtrl', function($scope,  $window, echoNestService, lastFmService, $rootScope){
    
    echoNestService.ArtistSearch.get({genre : 'classical', min_familiarity : 0.65},function(data){
       
        $scope.topArtists = data.response.artists;
        console.log($scope.topArtists);
    });
//XU: Too many repeat in the code, try to use the value of section...    
    var arts = [];
    angular.forEach(echoNestService.medievalArtists, function(value, key){
         if(value!= undefined){
                
            lastFmService.getArtist.get({artist : value.name},function(data){
                // console.log(data);
                var imgSrc = data['artist']['image'][2]['#text'];
                // var imgSrcArray = data.artist.image.map(function(image){ return image['#text'] });
                data.artist.mbid = value.id;
                data.artist.image = imgSrc;
                arts.push(data.artist);
                    
                console.log(arts);
            }); 
            $scope.MedievalArtists = arts;
               
        }
    });
    
//    RENAISSANCE
    
    echoNestService.ArtistSearch.get({genre : 'classical',artist_start_year_after : 1400, artist_end_year_before : 1600},function(data){
            console.log(data);
            $scope.renaissanceArtists = data.response.artists;
            angular.forEach($scope.renaissanceArtists, function(value, key){
                if(value.name != undefined){
                    lastFmService.getArtist.get({artist : value.name},function(data){
                        //console.log(data);
                        var imgSrc = data['artist']['image'][2]['#text'];
                        // var imgSrcArray = data.artist.image.map(function(image){ return image['#text'] });

                        value.finalName = data.artist.name;
                        value.image = imgSrc;
                        value.mbid = data.artist.mbid;
                    });
                }
            });
        });
    
//    Baroque
    echoNestService.ArtistSearch.get({genre : 'baroque'},function(data){
            console.log(data);
            $scope.baroqueArtists = data.response.artists;
            angular.forEach($scope.baroqueArtists, function(value, key){
                if(value.name != undefined){
                    lastFmService.getArtist.get({artist : value.name},function(data){
                        //console.log(data);
                        var imgSrc = data['artist']['image'][2]['#text'];
                        // var imgSrcArray = data.artist.image.map(function(image){ return image['#text'] });

                        value.finalName = data.artist.name;
                        value.image = imgSrc;
                        value.mbid = data.artist.mbid;
                    });
                }
            });
        });
//  Classical
    echoNestService.ArtistSearch.get({genre : 'classical period'},function(data){
            console.log(data);
            $scope.classicalArtists = data.response.artists;
            angular.forEach($scope.classicalArtists, function(value, key){
                if(value.name != undefined){
                    lastFmService.getArtist.get({artist : value.name},function(data){
                        //console.log(data);
                        var imgSrc = data['artist']['image'][2]['#text'];
                        // var imgSrcArray = data.artist.image.map(function(image){ return image['#text'] });

                        value.finalName = data.artist.name;
                        value.image = imgSrc;
                        value.mbid = data.artist.mbid;
                    });
                }
            });
        });
//    Romantic
    echoNestService.ArtistSearch.get({genre : 'classical',artist_start_year_after : 1815, artist_end_year_before : 1910},function(data){
            console.log(data);
            $scope.romanArtists = data.response.artists;
            angular.forEach($scope.romanArtists, function(value, key){
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
//    20 century
    echoNestService.ArtistSearch.get({genre : 'classical',artist_start_year_after : 1900, artist_end_year_before : 2000},function(data){
            console.log(data);
            $scope.twentyArtists = data.response.artists;
            angular.forEach($scope.twentyArtists, function(value, key){
                if(value.name != undefined){
                    lastFmService.getArtist.get({artist : value.name},function(data){
                        //console.log(data);
                        var imgSrc = data['artist']['image'][2]['#text'];
                        // var imgSrcArray = data.artist.image.map(function(image){ return image['#text'] });

                        value.finalName = data.artist.name;
                        value.image = imgSrc;
                        value.mbid = data.artist.mbid;
                    });
                }
            });
        });
    
});
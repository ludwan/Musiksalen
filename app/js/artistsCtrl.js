musiksalenApp.controller('ArtistsCtrl', function($scope,  $window, echoNestService, lastFmService){
    var resultsPerPage = 20; //Ludwig: Should this be 20 (5x4) or 16 (4x4)?

    // $scope.typeOptionsPeriod = [
    //     { name: 'All periods', value: 'classical' }, 
    //     { name: 'Medieval (476–1400)', value: 'early music' }, 
    //     { name: 'Renaissance (1400–1600)', value: 'renaissance' },
    //     { name: 'Baroque (1600–1760)', value: 'baroque' },
    //     { name: 'Classical period (1730–1820)', value: 'classical period' },
    //     { name: 'Romantic period (1815–1910)', value: '1815-1910' },
    //     { name: '20th century (1900–2000)', value: '1900-2000' }
    // ];

    $scope.typeOptionsPeriod = [
        { name: 'All periods', value: ['classical', 'early music', 'renaissance', 'baroque', 'classical period', 'romantic', 'modern classical', 'classical performance'] }, 
        { name: 'Medieval (476–1400)', value: 'early music' }, 
        { name: 'Renaissance (1400–1600)', value: 'renaissance' },
        { name: 'Baroque (1600–1760)', value: 'baroque' },
        { name: 'Classical period (1730–1820)', value: 'classical period' },
        { name: 'Romantic period (1815–1910)', value: 'romantic' },
        { name: '20th century (1900–2000)', value: 'modern classical' },
        { name: 'Classical performers', value: 'classical performance' }
    ];

    $scope.typeOptionsCountry = [
      {name:"All countries"},
      {name:"Argentina"},
      {name:"Australia"},
      {name:"Austria"},
      {name:"Belgium"},
      {name:"Brazil"},
      {name:"Canada"},
      {name:"Chile"}, //Performer
      {name:"China"}, //Performer
      {name:"Czech Republic"},
      {name:"Denmark"},
      {name:"Estonia"},
      {name:"Finland"},
      {name:"France"},
      {name:"Georgia"}, //Performer
      {name:"Germany"},
      {name:"Greece"},  //Performer
      {name:"Hungary"},
      {name:"Iceland"}, //Special music
      {name:"India"}, //Performer
      {name:"Ireland"},
      {name:"Israel"},  //Performer
      {name:"Italy"},
      {name:"Japan"}, //Special music
      {name:"Jersey"},
      {name:"Latvia"},  //Special music
      {name:"Lebanon"}, //Special music
      {name:"Lithuania"}, //Special music
      {name:"Mexico"},
      {name:"Monaco"},  //Special music
      {name:"Netherlands"},
      {name:"Norway"},
      {name:"Poland"},
      {name:"Portugal"},  //Special music
      {name:"Romania"},
      {name:"Russian Federation"},
      {name:"Serbia"},  //Performer
      {name:"Singapore"},
      {name:"Sint Maarten"},
      {name:"Singapore"}, //Special music
      {name:"Slovakia"},
      {name:"South Korea"}, //Performer
      {name:"Spain"},
      {name:"Sweden"},
      {name:"Switzerland"},
      {name:"Turkey"},  //Performer
      {name:"Ukraine"}, //Performer
      {name:"United Kingdom"},
      {name:"United States"},
      {name:"Venezuela"} //Special music
    ];

    $scope.typeOptionsSorting = [
        { name: 'Familiarity (Highest)', value: 'familiarity-desc' }, 
        { name: 'Familiarity (Lowest)', value: 'familiarity-asc' }, 
        { name: 'Hotness (Highest)', value: 'hotttnesss-desc' },
        { name: 'Hotness (Lowest)', value: 'hotttnesss-asc' },
        { name: 'Newest', value: 'artist_start_year-desc' },
        { name: 'Oldest', value: 'artist_start_year-asc' }
    ];


    $scope.pager = 0;
    $scope.loading = 0;
    $scope.genre = $scope.typeOptionsPeriod[0].value;
    $scope.country = $scope.typeOptionsCountry[0].name;
    $scope.sort = $scope.typeOptionsSorting[0].value;
    $scope.onFirstPage = true;
    $scope.onLastPage = false;

    $scope.handleData = function(data){
        $scope.loading++;
        $scope.artists = data.response.artists;
        if($scope.artists.length < resultsPerPage){
            $scope.onLastPage = true;
        }
        lastFmService.updateArtists($scope.artists);
        $scope.loading--;
    } 
    
// filter is searching keyword
// 4.5 finish the filter for artists with period, country

    // $scope.filteredArtists = function(genre, country) {
    //     console.log("filteredArtists");

    //     if(genre=="1815-1910" || genre=="1900-2000"){
    //         var start, end;
    //         start = Number(genre.substr(0,4));
    //         end = Number(genre.substr(5,4));
            
    //         echoNestService.ArtistSearch.get({genre : "classical", artist_start_year_after : start, artist_end_year_before : end, artist_location : country, start : $scope.pager},function(data){
    //             console.log(data);
    //             $scope.handleData(data);
    //         });
    //     } else if(genre==="classical"){
    //         echoNestService.ArtistSearch.get({genre : "classical", artist_location : country, start : $scope.pager},function(data){
    //             console.log(data);
    //             $scope.handleData(data);
    //         });
    //     } else if(genre==="early music"){
    //         echoNestService.ArtistSearch.get({genre : "early music", artist_start_year_after : 476, artist_end_year_before : 1400, artist_location : country, start : $scope.pager},function(data){
    //             console.log(data);
    //             $scope.handleData(data);
    //         });
    //     }else{
    //         echoNestService.ArtistSearch.get({genre : genre, artist_location : country, artist_end_year_before:2000, start : $scope.pager},function(data){
    //             console.log(data);
    //             $scope.handleData(data);
    //         });
    //     }
    // };

    //Ludwig: This is simpler and includes more artists (Those who does not have any active yers) however 
    //it also includes artists that plays a specific genre but not necessarily from that time period
    //What do you think is the better one?
    //From the code point of view it's definitely better! I was trying to keep it more accurate to the time period and composer, since take medieval for example, you can see some modern group..
    // $scope.filteredArtists = function(selectedGenre, country){
    //     echoNestService.ArtistSearch.get({genre : selectedGenre, artist_location : country, start : $scope.pager},function(data){
    //             $scope.handleData(data);
    //             $scope.loading--;
    //     });
        
    $scope.filteredArtists = function(){
      var selectedCountry;
      console.log($scope.country);
      console.log($scope.genre);

      if($scope.country != "All countries"){
        selectedCountry = $scope.country;
      }

      echoNestService.ArtistSearch.get({genre : $scope.genre, artist_location : selectedCountry, start : $scope.pager, sort : $scope.sort},function(data){
              console.log(data);
              $scope.handleData(data);
              $scope.loading--;
      });
    }

    //Pagination methods
    $scope.nextPage = function(){
        $scope.loading++;
        $scope.pager += resultsPerPage;
        $scope.onFirstPage = false;
        $scope.filteredArtists();
    }

    $scope.previousPage = function(){
        $scope.loading++;
        $scope.pager -= resultsPerPage;
        if($scope.pager == 0){
            $scope.onFirstPage = true;
        }
        $scope.onLastPage = false;
        $scope.filteredArtists();
    }

    $scope.firstPage = function(){
        $scope.loading++;
        $scope.pager = 0;
        $scope.onFirstPage = true;
        $scope.onLastPage = false;
        $scope.filteredArtists();
    }

    $scope.firstPage();

});
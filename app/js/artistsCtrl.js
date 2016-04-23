musiksalenApp.controller('ArtistsCtrl', function($scope, $cookieStore, $filter, echoNestService, lastFmService){
    var resultsPerPage = 20; //Ludwig: Should this be 20 (5x4) or 16 (4x4)?

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

    $scope.loading = 0;
    $scope.pager = $cookieStore.get('pager');
    var NumOfCountry = $cookieStore.get('NumOfCountry');
    var NumOfPeriod = $cookieStore.get('NumOfPeriod');
    var NumOfSort = $cookieStore.get('NumOfSort');
//    var Query = $cookieStore.get('Query');

    if($scope.pager === undefined){
      $scope.pager = 0;
    }    
    if(NumOfCountry === undefined){
        NumOfCountry = 0;
    }
    if(NumOfPeriod === undefined){
        NumOfPeriod = 0;
    }
    if(NumOfSort === undefined){
        NumOfSort = 0;
    }

    if($scope.pager == 0){
        $scope.onFirstPage = true;
    } else {
        $scope.onFirstPage = false;
    }
//    if(Query === undefined){
//        Query = null;
//    }
//    
    
    $scope.genre = $scope.typeOptionsPeriod[NumOfPeriod].value;
    $scope.country = $scope.typeOptionsCountry[NumOfCountry].name;
    $scope.sort = $scope.typeOptionsSorting[NumOfSort].value;
    
    $scope.handleData = function(data){
        $scope.loading++;
        $scope.artists = data;
        if($scope.artists.length < resultsPerPage){
            $scope.onLastPage = true;
        }
        lastFmService.updateArtists($scope.artists);
        $scope.loading--;
    } 
    
    $scope.findIndex = function(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return i;
            }
        }
        return null;
    }
    
    $scope.searchArtists = function(){
        $scope.loading++;
        var selectedCountry;
        if($scope.country != "All countries"){
            selectedCountry = $scope.country;
        }
        echoNestService.ArtistSearch.get({name : $scope.query, fuzzy_match : true, genre: $scope.genre}, function(data){
            $scope.array = data;
            var filteredData = $filter('filter')(data.response.artists, selectedCountry);
            $scope.handleData(filteredData);
            $scope.loading--;
        }, function(error){
            $scope.error = true;
            $scope.errorMessage = "There was an error while searching for artists";
        });     
    }

    $scope.filteredArtists = function(){
        $scope.query = "";
        $scope.loading++;
        var selectedCountry;
        $scope.storeCookie();
        
        if($scope.country != "All countries"){
            selectedCountry = $scope.country;
        }
        echoNestService.ArtistSearch.get({genre : $scope.genre, artist_location : selectedCountry, start : $scope.pager, sort : $scope.sort, fuzzy_match : true},function(data){
            $scope.handleData(data.response.artists);
            $scope.loading--;
        }, function(error){
            $scope.error = true;
            $scope.errorMessage = "There was an error while filtering artists";
        });
    }   
    
    //Pagination methods
    $scope.nextPage = function(){
        $scope.pager += resultsPerPage;
        $scope.onFirstPage = false;
        $scope.filteredArtists();
    }

    $scope.previousPage = function(){
        $scope.pager -= resultsPerPage;
        if($scope.pager == 0){
            $scope.onFirstPage = true;
        }
        $scope.onLastPage = false;
        $scope.filteredArtists();
    }

    $scope.firstPage = function(){
        $scope.pager = 0;
        $scope.onFirstPage = true;
        $scope.onLastPage = false;
        $scope.filteredArtists();
    }

    $scope.storeCookie = function(){
        $cookieStore.put('pager',$scope.pager);
        $cookieStore.put('NumOfCountry',  $scope.findIndex($scope.typeOptionsCountry, "name", $scope.country));
        $cookieStore.put('NumOfPeriod', $scope.findIndex($scope.typeOptionsPeriod, "value", $scope.genre));
        $cookieStore.put('NumOfSort', $scope.findIndex($scope.typeOptionsSorting, "value", $scope.sort));
    }

    $scope.filteredArtists();   
    
});
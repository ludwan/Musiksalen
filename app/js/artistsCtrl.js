musiksalenApp.controller('ArtistsCtrl', function($scope, $window, $cookieStore, echoNestService, lastFmService){
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
    var NumOfCountry = $cookieStore.get('NumOfCountry');
    var NumOfPeriod = $cookieStore.get('NumOfPeriod');
    var NumOfSort = $cookieStore.get('NumOfSort');
//    var Query = $cookieStore.get('Query');
    
    if(NumOfCountry === undefined){
        NumOfCountry = 0;
    }
    if(NumOfPeriod === undefined){
        NumOfPeriod = 0;
    }
    if(NumOfSort === undefined){
        NumOfSort = 0;
    }
//    if(Query === undefined){
//        Query = null;
//    }
//    
    console.log(NumOfCountry);
    
    $scope.genre = $scope.typeOptionsPeriod[NumOfPeriod].value;
    $scope.country = $scope.typeOptionsCountry[NumOfCountry].name;
    $scope.sort = $scope.typeOptionsSorting[NumOfSort].value;
    
    $scope.onFirstPage = true;
    $scope.onLastPage = false;

    
    $scope.handleData = function(data){
        $scope.loading++;
        $scope.artists = data.response.artists;
        console.log($scope.artists);
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
    
    $scope.searchArtists = function(query,$event){
//        query = Query;
        var keyCode = $event.which || $event.keyCode;
//        $cookieStore.put('Query', query);
        
        echoNestService.ArtistSearch.get({name : query, fuzzy_match : true, genre: "classical"}, function(data){
                $scope.handleData(data);
               
                console.log(data);
        });
        
        if (keyCode === 13) {
            console.log("searching!")
            echoNestService.ArtistSearch.get({name : query, fuzzy_match : true, genre: "classical"}, function(data){
                $scope.handleData(data);
               
                console.log(data);
            });
        };
        
      }
    
    $scope.filteredArtists = function(){
      var selectedCountry;
      $cookieStore.put('NumOfCountry',  $scope.findIndex($scope.typeOptionsCountry, "name", $scope.country));
      $cookieStore.put('NumOfPeriod', $scope.findIndex($scope.typeOptionsPeriod, "value", $scope.genre));
      $cookieStore.put('NumOfSort', $scope.findIndex($scope.typeOptionsSorting, "value", $scope.sort));
        
      if($scope.country != "All countries"){
        selectedCountry = $scope.country;
      }
        

      console.log("searching!")
      echoNestService.ArtistSearch.get({genre : $scope.genre, artist_location : selectedCountry, start : $scope.pager, sort : $scope.sort},function(data){
//              console.log(data);
              $scope.handleData(data);
              $scope.loading--;
      });
    }
    
    //Pagination methods
    $scope.nextPage = function(){
        $scope.loading++;
        $scope.pager += resultsPerPage;
        $cookieStore.put('pager',$scope.pager);
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
        $cookieStore.put('pager',$scope.pager);
        $scope.filteredArtists();
    }

    $scope.firstPage = function(){
        $scope.loading++;
        $scope.pager = $cookieStore.get('pager');
        if($scope.pager === 0){
            $scope.onFirstPage = true;
            $scope.onLastPage = false;
        } else if($scope.pager !== 0){
            $scope.onFirstPage = false;  
        }
        
        $scope.filteredArtists();
    }

    $scope.firstPage();
    
    
});
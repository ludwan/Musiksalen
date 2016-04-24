musiksalenApp.controller('ArtistsCtrl', function($scope, $cookieStore, $filter, echoNestService, lastFmService){
    var resultsPerPage = 20;

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
    
    $scope.genre = $scope.typeOptionsPeriod[NumOfPeriod].value;
    $scope.country = $scope.typeOptionsCountry[NumOfCountry].name;
    $scope.sort = $scope.typeOptionsSorting[NumOfSort].value;
    
    //This function handles the data recieved from the 'searchArtists' and 'filteredArtists' and calls
    //the 'updateArtists' function from the lastFmService to add pictures to the artists. The function also
    //checks if the query is on the last page by checking if the results are less than the given maxResults.
    //This is needed since ECHO NEST does not state how many results there are in TOTAL that match a given query
    $scope.handleData = function(data){
        $scope.loading++;
        $scope.artists = data;
        if($scope.artists.length < resultsPerPage){
            $scope.onLastPage = true;
        }
        lastFmService.updateArtists($scope.artists);
        $scope.loading--;
    } 
    
    //This function is used to find the index in the options array that matches the current selected filter.
    //This index is what is being saved in the cookie.
    $scope.findIndex = function(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return i;
            }
        }
        return null;
    }
    
    //This function is used to make a ner search for artists that match the search query as well as the current selected genre
    //The resuts will then be filtered to match the current country selected to match the setting that the user had entered. This
    //is done with the help of the echoNestService's 'ArtistSearch' resource. The search does not take into account artist location
    //until after the query since ECHO NEST does not allow searching for names and locations in the same location. Since the risk of
    //having more than 20 matches (maxResults per page) from ArtistSearch when searching for artist names is minimal this is deemed as sufficient 
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
            $scope.loading = 0;
            $scope.error = true;
            $scope.errorMessage = "There was an error while searching for artists";
        });     
    }

    //This method is used to make a new search for artists that match the current filtering which is done
    //via echoNestService's 'ArtistSearch' resource. The resource will take into account the selected
    //genre, artist location and the start of the current page. The info retrieved will then be sent to the
    //function handleData to retrieve additional information about artists. The filtering does NOT take into
    //account the current search info. This is because the ECHO NEST API does allow artist location and artist
    //names to be used in the same query. Therefore to illustrate this to the user in an intuitive manner, when a 
    //filter is changed the search box will be emptied. This is different than to the "searchArtists" method due 
    //to the fact that multiple countries has more results than 20. Leaving a massive amount of edge cases and 
    //general complexity if the results would be filtered by the search query afterwards
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
            $scope.loading = 0;
            $scope.error = true;
            $scope.errorMessage = "There was an error while filtering artists";
        });
    }   
    
    //Pagination methods
    //This method is used to move forward a page with the current filtering
    $scope.nextPage = function(){
        $scope.pager += resultsPerPage;
        $scope.onFirstPage = false;
        $scope.filteredArtists();
    }

    //This method is used to move back a page with the current filtering
    $scope.previousPage = function(){
        $scope.pager -= resultsPerPage;
        if($scope.pager == 0){
            $scope.onFirstPage = true;
        }
        $scope.onLastPage = false;
        $scope.filteredArtists();
    }

    //This function is used to move to the first page with the current filtering
    $scope.firstPage = function(){
        $scope.pager = 0;
        $scope.onFirstPage = true;
        $scope.onLastPage = false;
        $scope.filteredArtists();
    }

    //This function is used to store the latest filtering in a cookie
    $scope.storeCookie = function(){
        $cookieStore.put('pager',$scope.pager);
        $cookieStore.put('NumOfCountry',  $scope.findIndex($scope.typeOptionsCountry, "name", $scope.country));
        $cookieStore.put('NumOfPeriod', $scope.findIndex($scope.typeOptionsPeriod, "value", $scope.genre));
        $cookieStore.put('NumOfSort', $scope.findIndex($scope.typeOptionsSorting, "value", $scope.sort));
    }
    
    $scope.removeCookie = function(){
        $cookieStore.remove('pager');
        $cookieStore.remove('NumOfCountry');
        $cookieStore.remove('NumOfPeriod');
        $cookieStore.remove('NumOfSort');
    }

    $scope.filteredArtists();   
    
});
musiksalenApp.controller('ArtistsCtrl', function($scope,  $window, echoNestService, $rootScope){
    
    echoNestService.ArtistSearch.get({genre : 'classical'},function(data){
        $scope.artists = data.response.artists;
        console.log(data.response.artists);
    });
    
    // filter is searching keyword
    // 4.5 finish the filter for artists with period, country
    $scope.filteredArtists = function(period, country, filter) {
        return $scope.artists.filter(function(index, artist) {
            var found = true;
            if(filter){
                found = false;
                if(artist.name = filter) {
                    found = true;
                };
                if(artist.name.indexOf(filter) != -1){
                    found = true;
                }
            }
            return artist.years_active == period && artist.artist_location == country && found;
        });
    }

    
}).directive('checkImage', function($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            attrs.$observe('ngSrc', function(ngSrc) {
                $http.get(ngSrc).success(function(){
                    //alert('image exist');
                }).error(function(){
                    //alert('image not exist');
                    element.attr('src', 'http://upload.wikimedia.org/wikipedia/commons/7/73/Lion_waiting_in_Namibia.jpg'); // set default image
                });
            });
        }
    };
});

//	this.getAllDishes = function (type,filter) {
//	  return $(dishes).filter(function(index,dish) {
//		var found = true;
//		if(filter){
//			found = false;
//			$.each(dish.ingredients,function(index,ingredient) {
//				if(ingredient.name.indexOf(filter)!=-1) {
//					found = true;
//				}
//			});
//			if(dish.name.indexOf(filter) != -1)
//			{
//				found = true;
//			}
//		}
//	  	return dish.type == type && found;
//	  });	
//	}
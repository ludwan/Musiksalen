musiksalenApp.service('firebaseService', ['$http', '$q', function (userService, $q){
	var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");
	var artistRef = new Firebase("https://sweltering-inferno-7067.firebaseio.com/favoriteArtists");
    var songRef = new Firebase("https://sweltering-inferno-7067.firebaseio.com/favoriteSongs");

    //Removes a favorite artist to the back-end
    this.addFavoriteArtist = function(userId, artistId) {
    	var array = {};
        var userRef = artistRef.child(userId);

        array[artistId] = true;
        userRef.update(array);
    }

    //Adds a favorite artist to the back-end
    this.removeFavoriteArtist = function(userId, artistId) {
    	var string = userId + "/" + artistId;
        var favoriteRef = artistRef.child(string);

        favoriteRef.remove();
    }

    //returns a specific artist from a specific user
    this.checkFavoriteArtist = function(userId, artistId){
        var deferred = $q.defer();
        var string = userId + "/" + artistId;
        var favoriteRef = artistRef.child(string);

        favoriteRef.on("value", function (snapshot) {
            deferred.resolve(snapshot.val());
        }, function (errorObject) {
            deferred.reject(errorObject);
        });
        return deferred.promise;
    }

    //Returns all artists from a specific user
    this.getFavoriteArtists = function(userId){
        var deferred = $q.defer();
        var favArtistsRef = artistRef.child(userId);

        favArtistsRef.on("value", function (snapshot) {
            deferred.resolve(snapshot.val());
        }, function (errorObject) {
            deferred.reject(errorObject);
        });
        return deferred.promise;
    }

    //Adds a favorite song to the back-end
    this.addFavoriteSong = function(userId, artistId, workId) {
    	var array = {};
        var string = userId + "/" + artistId;
        var favoriteSongRef = songRef.child(string);

        array[workId] = true;
        favoriteSongRef.update(array, onComplete);
    }

    //Removes a favorite song to the back-end
    this.removeFavoriteSong = function(userId, artistId, workId) {
    	var string = userId + "/" + artistId + "/" + workId;
    	var favoriteSongRef = songRef.child(string);

    	favoriteSongRef.remove(onComplete);
    }


    //Returns a specific work from a specific user
    this.checkFavoriteSong = function(userId, artistId, workId) {
        var deferred = $q.defer();
        if(workId == undefined){
            var string = userId + "/" + artistId;
        } else {
            var string = userId + "/" + artistId + "/" + workId;
        }
        var favoriteSongRef = songRef.child(string);

        favoriteSongRef.on("value", function (snapshot) {
            deferred.resolve(snapshot.val());
        }, function (errorObject) {
            deferred.reject(errorObject);
        });
        return deferred.promise;
    }

    //Returns all songs related to a specific user
    this.getFavoriteSongs = function(userId) {
        var deferred = $q.defer();
        var favSongsRef = songRef.child(userId);

        favSongsRef.on("value", function (snapshot) {
            deferred.resolve(snapshot.val());
        }, function (errorObject) {
            deferred.reject(errorObject);
        });
        return deferred.promise;
    }

}]);
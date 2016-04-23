musiksalenApp.service('firebaseService', ['$http', '$q', function (userService, $q){
	var ref = new Firebase("https://sweltering-inferno-7067.firebaseio.com");
	var artistRef = new Firebase("https://sweltering-inferno-7067.firebaseio.com/favoriteArtists");
    var songRef = new Firebase("https://sweltering-inferno-7067.firebaseio.com/favoriteSongs");

    var onComplete = function(error) {
        //TODO some proper error handling with windows etc instead
        if (error) {
            console.log('Synchronization failed');
        } else {
            console.log('Synchronization succeeded');
        }
    };

    this.addFavoriteArtist = function(userId, artistId) {
    	var array = {};
        var userRef = artistRef.child(userId);

        array[artistId] = true;
        userRef.update(array, onComplete);
    }

    this.removeFavoriteArtist = function(userId, artistId) {
    	var string = userId + "/" + artistId;
        var favoriteRef = artistRef.child(string);

        favoriteRef.remove(onComplete);
    }

    this.checkFavoriteArtist = function(userId, artistId){
        var deferred = $q.defer();
        var string = userId + "/" + artistId;
        var favoriteRef = artistRef.child(string);

        favoriteRef.on("value", function (snapshot) {
            deferred.resolve(snapshot.val());
        }, function (errorObject) {
            //TODO some proper error handling with windows etc
            console.log("The read failed: " + errorObject.code);
        });
        return deferred.promise;
    }

    this.getFavoriteArtists = function(userId){
        var deferred = $q.defer();
        var favArtistsRef = artistRef.child(userId);

        favArtistsRef.on("value", function (snapshot) {
            deferred.resolve(snapshot.val());
        }, function (errorObject) {
            //TODO PROPER ERROR HANDLING
            console.log("The read failed: " + errorObject.code);
        });
        return deferred.promise;
    }

    this.addFavoriteSong = function(userId, artistId, workId) {
    	var array = {};
        var string = userId + "/" + artistId;
        var favoriteSongRef = songRef.child(string);

        array[workId] = true;
        favoriteSongRef.update(array, onComplete);
    }

    this.removeFavoriteSong = function(userId, artistId, workId) {
    	var string = userId + "/" + artistId + "/" + workId;
    	var favoriteSongRef = songRef.child(string);

    	favoriteSongRef.remove(onComplete);
    }


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
            //TODO some proper error handling with windows etc
            console.log("The read failed: " + errorObject.code);
        });
        return deferred.promise;
    }

    this.getFavoriteSongs = function(userId) {
        var deferred = $q.defer();
        var favSongsRef = songRef.child(userId);

        favSongsRef.on("value", function (snapshot) {
            deferred.resolve(snapshot.val());
        }, function (errorObject) {
            //TODO PROPER ERROR HANDLING
            console.log("The read failed: " + errorObject.code);
        });
        return deferred.promise;
    }

}]);
musiksalenApp.service('youtubeService', ['$http', '$q', function ($http, $q) {
    var apiKey = 'AIzaSyAdAGKp13vOjtEcBUqTiK6Q4u8iLzWY_6Q';  

    this.worksSearch = function (keyWord, maxRes) {
        var deferred = $q.defer();

        console.log("In worksSearch");
        gapi.client.setApiKey(apiKey);
        gapi.client.load('youtube', 'v3', function() {
            var request = gapi.client.youtube.search.list({
                                q: keyWord,
                                part: 'snippet',
                                maxResults: maxRes,
                                order: 'relevance',
                                fields: 'items(id,snippet(thumbnails, title))',
                                type: 'video'
                            });
            request.execute(function(response) {
                console.log(response.result);
                deferred.resolve(response.result);
            });
        });
        return deferred.promise;
    };

    this.getFullDescription = function (videoId){
        var deferred = $q.defer();

        console.log("In youtubeService getFullDescription");
        gapi.client.setApiKey(apiKey);
        gapi.client.load('youtube', 'v3', function() {
            var request = gapi.client.youtube.videos.list({
                part: 'snippet',
                id: videoId,
                fields: 'items(snippet(description))'
            });
            request.execute(function(response){
                deferred.resolve(response.result);
            });
        });
        return deferred.promise;
    };

    this.createPlayer = function(player, videoId){
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: videoId
        });
    }
}]);
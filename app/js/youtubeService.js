musiksalenApp.service('youtubeService', ['$http', '$q', function ($http, $q) {
    var apiKey = 'AIzaSyAdAGKp13vOjtEcBUqTiK6Q4u8iLzWY_6Q';
    var deferred = $q.defer();

    this.worksSearch = function (keyWord) {
        console.log("In googleApiClientReady");
        gapi.client.setApiKey(apiKey);
        gapi.client.load('youtube', 'v3', function() {
            var request = gapi.client.youtube.search.list({
                                q: keyWord,
                                part: 'snippet',
                                maxResults: 10,
                                order: 'relevance'
                            });
            request.execute(function(response) {
                deferred.resolve(response.result);
            });
        });
        return deferred.promise;
    };
}]);
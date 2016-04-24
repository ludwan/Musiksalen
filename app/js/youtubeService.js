//This is for loading the script required to use a youtube player
var tag = document.createElement('script');
var firstScriptTag = document.getElementsByTagName('script')[0];

tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

musiksalenApp.service('youtubeService', ['$http', '$q', function ($http, $q) {
    var apiKey = 'AIzaSyAdAGKp13vOjtEcBUqTiK6Q4u8iLzWY_6Q';  

    //This function is used for searching videos within youtube. The function takes
    //a keyword and max amount of results as arguments and retrieves id's, thumbnails
    //and titles of the videos that are returned from the search with the keyWord
    this.worksSearch = function (keyWord, maxRes) {
        var deferred = $q.defer();

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
                deferred.resolve(response.result);
            });
        });
        return deferred.promise;
    };

    //This function is used for retrieving the full description of a video
    //Taking a videoId as an argument and returning the video description
    //corresponding to that videoId.
    this.getFullDescription = function (videoId){
        var deferred = $q.defer();

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

    //This function is used to create a youtube player with 
    //videoId loaded in it. Whenever a youtube video is loaded and using chrome
    //3 errors will be shown this is due to the fact that youtube tries to connect to
    //chrome's cast app wether it is installed or not. The only fix for this when using 
    //chrome is to install the app. These errors does not however affect the app in any way except
    //of showing up in the console
    this.createPlayer = function(player, videoId){
        player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: videoId
        });
    }

}]);
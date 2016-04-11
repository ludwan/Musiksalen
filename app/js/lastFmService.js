musiksalenApp.service('lastFmService', function ($resource, $q, $http){
    
    var apiKey = '0951e663aa56faa1ff6d770f2ebb6d30'; 
    
    this.getArtist = $resource('http://ws.audioscrobbler.com/2.0/?',{
        method : 'artist.getinfo',
        format : 'json', 
        api_key : apiKey,
        autocorrect : 1
    });

    this.getWorks = $resource('http://ws.audioscrobbler.com/2.0/?',{
        method : 'artist.gettoptracks',
        format : 'json',
        api_key : apiKey,
        autocorrect : 1
    });
    this.getWorkInfo = $resource('http://ws.audioscrobbler.com/2.0/?',{
        method : 'track.getinfo',
        format : 'json',
        api_key : apiKey
    });

    this.updateArtists = function(list){
        var getArtistVar = this.getArtist;
        angular.forEach(list, function(value, key){
            if(value.name != undefined){
                getArtistVar.get({artist : value.name},function(data){
                    //console.log(data);
                    var imgSrc = data['artist']['image'][2]['#text'];

                    value.finalName = data.artist.name;
                    value.image = imgSrc;
                    value.mbid = data.artist.mbid;
                });
            }
        });
    }
});
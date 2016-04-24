musiksalenApp.service('lastFmService', function ($resource, $q, $http){
    
    var apiKey = '0951e663aa56faa1ff6d770f2ebb6d30'; 
    
    //This is used to get information about an artist more specifically images and
    //bio. These are not available in the ECHO NEST API
    this.getArtist = $resource('https://ws.audioscrobbler.com/2.0/?',{
        method : 'artist.getinfo',
        format : 'json', 
        api_key : apiKey,
        autocorrect : 1
    });

    //This function is used when multiple artists need images at the same time
    //For example when listing artists of a particular genre. Since the LAST-FM
    //API only allows to search for one artist at a time there is a need for 
    // a loop to iterate and retrieve inforation about every artist
    this.updateArtists = function(list){
        var getArtistVar = this.getArtist;
        angular.forEach(list, function(value, key){
            if(value.name != undefined){
                value.image = "../images/score-placeholder.png";
                getArtistVar.get({artist : value.name},function(data){
                    var imgSrc = data['artist']['image'][2]['#text'];

                    if(imgSrc !== undefined){
                        value.image = imgSrc;
                    }                   
                }, function (error) {
                    console.log("Could not retrieve information: " + error);
                });
            }
            
        });       
    }
});
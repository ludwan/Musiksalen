musiksalenApp.service('echoNestService', function ($http,$resource){
    
    var apiKey = '4IGS4L1R7UE1N2UKS';
    $http.defaults.useXDomain = true;
    //Searches for artists
    this.ArtistSearch = $resource('https://developer.echonest.com/api/v4/artist/search?bucket=artist_location', {
        format : 'json',
        api_key : apiKey,
        sort : 'familiarity-desc',
        results : 20 
    });
    
    //Returns information about artists
    this.getArtist = $resource('https://developer.echonest.com/api/v4/artist/profile?bucket=artist_location&bucket=years_active&bucket=genre',{
        format : 'json', 
        api_key : apiKey
    });

    //Returns only the most basic information about artists (name and id)
    this.getBasicArtist = $resource('https://developer.echonest.com/api/v4/artist/profile?', {
        format : 'json',
        api_key : apiKey
    });

    //Returns information about work (name and id of both song and artist)
    this.getWork = $resource('https://developer.echonest.com/api/v4/song/profile?',{
        format : 'json',
        api_key : apiKey
    });

    //Returns songs related to an artist. Does not return duplicates
    this.workPlaylistSearch = $resource('https://developer.echonest.com/api/v4/playlist/static?&bucket=song_hotttnesss&bucket=song_currency', {
        format : 'json',
        type : 'artist',
        api_key : apiKey,
        results : 100,
        sort : 'song_currency-desc'
    });
    
});
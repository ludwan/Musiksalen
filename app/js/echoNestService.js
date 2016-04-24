musiksalenApp.service('echoNestService', function ($resource){
    
    var apiKey = '4IGS4L1R7UE1N2UKS'; 
    this.ArtistSearch = $resource('https://developer.echonest.com/api/v4/artist/search?bucket=artist_location', {
        format : 'json',
        api_key : apiKey,
        sort : 'familiarity-desc',
        results : 20 
    });
    
    this.getArtist = $resource('https://developer.echonest.com/api/v4/artist/profile?bucket=artist_location&bucket=years_active&bucket=genre',{
        format : 'json', 
        api_key : apiKey
    });

    this.getBasicArtist = $resource('https://developer.echonest.com/api/v4/artist/profile?', {
        format : 'json',
        api_key : apiKey
    });

    this.getWork = $resource('https://developer.echonest.com/api/v4/song/profile?',{
        format : 'json',
        api_key : apiKey
    });

    this.getArtistWorks = $resource('https://developer.echonest.com/api/v4/artist/songs?', {
        format : 'json',
        api_key : apiKey,
        results : 20
    });

    this.workSearch = $resource('https://developer.echonest.com/api/v4/song/search?&bucket=song_hotttnesss&bucket=song_hotttnesss_rank', {
        format : 'json',
        api_key : apiKey,
        sort : 'song_hotttnesss-desc',
        results : 20
    });

    this.workPlaylistSearch = $resource('https://developer.echonest.com/api/v4/playlist/static?&bucket=song_hotttnesss&bucket=song_currency', {
        format : 'json',
        type : 'artist',
        api_key : apiKey,
        results : 50,
        sort : 'song_currency-desc'
    });
    
});
musiksalenApp.service('echoNestService', function ($resource){
    
    var apiKey = '4IGS4L1R7UE1N2UKS'; 
    this.ArtistSearch = $resource('http://developer.echonest.com/api/v4/artist/search?bucket=images&bucket=artist_location&bucket=years_active&bucket=genre', {
        format : 'json',
        //fuzzy_match : true,
        // artist_end_year_before : 2000,
        api_key : apiKey,
        sort : 'familiarity-desc',
        results : 20 
    });
    
    this.getArtist = $resource('http://developer.echonest.com/api/v4/artist/profile?bucket=images&bucket=artist_location&bucket=years_active&bucket=biographies&bucket=songs&bucket=genre',{
        format : 'json', 
        api_key : apiKey
    });

    this.getWork = $resource('http://developer.echonest.com/api/v4/song/profile?',{
        format : 'json',
        api_key : apiKey
    });

    this.getArtistWorks = $resource('http://developer.echonest.com/api/v4/artist/songs?', {
        format : 'json',
        api_key : apiKey,
        results : 20
    });

    this.workSearch = $resource('http://developer.echonest.com/api/v4/song/search?&bucket=song_hotttnesss&bucket=song_hotttnesss_rank', {
        format : 'json',
        api_key : apiKey,
        sort : 'song_hotttnesss-desc',
        results : 20
    });

    this.workPlaylistSearch = $resource('http://developer.echonest.com/api/v4/playlist/static?&bucket=song_hotttnesss&bucket=song_currency', {
        format : 'json',
        type : 'artist',
        api_key : apiKey,
        results : 50
    });
    
    this.medievalArtists = [{"id":"ARUXZG81187FB5ACA0","name":"Hildegard von Bingen"}, {"id":"ARFHCDF1187FB5AB93","name":"Léonin"}, {"id":"ARZZ6AV1187FB412D9","name":"Pérotin"}, {"id":"AR2JVUX1187FB5CEF5","name":"Guillaume de Machaut"}];
    
    
});
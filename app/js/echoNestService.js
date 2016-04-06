musiksalenApp.service('echoNestService', function ($resource){
    
    var apiKey = '4IGS4L1R7UE1N2UKS'; 
    this.ArtistSearch = $resource('http://developer.echonest.com/api/v4/artist/search?bucket=images&bucket=artist_location&bucket=years_active', {
        format : 'json',
        min_familiarity : 0.65, // this parameter should be used for home page
        fuzzy_match : true,
        api_key : apiKey 
    });
    
    this.getArtist = $resource('http://developer.echonest.com/api/v4/artist/profile?bucket=images&bucket=artist_location&bucket=years_active&bucket=biographies&bucket=songs&bucket=genre',{
        format : 'json', 
        api_key : apiKey
    });

    this.getWork = $resource('http://developer.echonest.com/api/v4/song/search?',{
        format : 'json',
        api_key : apiKey,

    });
});
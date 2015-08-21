
angular.module('jamApp.services', [])


.factory('CityInfo', function ($http) {
  var echokey = 'APRGVYHQGMQ5FKTYM'
  var consumerKey = 'ce78d10e8183380fb57357cc8a07e29d'
  var echoSharedSecret = 'YhNZOH5TRUWGMogv/2XCZw'
  var songkickKey = 'ngIhxhYsLMjkEU8y'

  var getCityId = function (city) {
    return $http.jsonp("http://api.songkick.com/api/3.0/search/locations.json?query="+city+"&apikey="+songkickKey+"&jsoncallback=JSON_CALLBACK")
    .success(function (resp) {

      var cityId = resp.resultsPage.results.location[0].metroArea.id

      //getCityEvents(cityId)
    return resp.data;
    });
    // })
  }

  var getCityEvents = function (cityId) {
    return $http.jsonp("https://api.songkick.com/api/3.0/metro_areas/"+cityId+"/calendar.json?apikey="+songkickKey+"&jsoncallback=JSON_CALLBACK")
    .success(function(data){
      console.log('big',data)
      var events = data.resultsPage.results.event
    })
  };

  return {
    getCityEvents: getCityEvents,
    getCityId: getCityId
  };
})

.factory('ArtistInfo', function ($http){
    function getSpotifyIds(songkickId){
    return $http
      .jsonp("http://developer.echonest.com/api/v4/artist/profile?api_key=APRGVYHQGMQ5FKTYM&id=songkick:artist:"+songkickId+"&bucket=id:spotify&format=jsonp&callback=JSON_CALLBACK")
      .success(function(data) {
        console.log(data)

      })
      .error(function(data) {console.log(data)})
  }
    return {
      getSpotifyIds: getSpotifyIds
    }
})
.factory('AddToSpotify', function ($http){
   function hotTracks (artistId) {
    console.log('artistId factory', artistId)
     $http.get('/hotTracks', {params :{artistId: artistId}})
     .then(function(response){
       console.log(response)
     }, function(err){
       console.log(err)
     })

   }
   return {
    hotTracks: hotTracks
  }
});


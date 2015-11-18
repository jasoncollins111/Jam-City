
var echokey = 'APRGVYHQGMQ5FKTYM';
var consumerKey = 'ce78d10e8183380fb57357cc8a07e29d';
var echoSharedSecret = 'YhNZOH5TRUWGMogv/2XCZw';
var songkickKey = 'ngIhxhYsLMjkEU8y';
angular.module('jamApp.services', [])


.factory('CityInfo', function ($http) {

  var getCityId = function (city) {
    return $http.jsonp("http://api.songkick.com/api/3.0/search/locations.json?query="+city+"&apikey="+songkickKey+"&jsoncallback=JSON_CALLBACK")
    .success(function (resp) {
      var cityId = resp.resultsPage.results.location[0].metroArea.id
      return resp.data;
    });
  }

  var getCityEvents = function (cityId) {
    return $http.jsonp("https://api.songkick.com/api/3.0/metro_areas/"+cityId+"/calendar.json?apikey="+songkickKey+"&jsoncallback=JSON_CALLBACK")
    .success(function(data){
      return data.resultsPage.results.event;
    })
  };



  var getCityEventsLatng = function(lat, lng){
    console.log('lat ',lat);
    console.log('lng ',lng);

    return $http.jsonp("http://api.songkick.com/api/3.0/search/locations.json?location=geo:"+lat+","+lng+"&apikey="+songkickKey+"&jsoncallback=JSON_CALLBACK")
      .success(function(data){
        return data.resultsPage.results.location[0].metroArea.displayName;
      })
      .error(function(error, b){
        console.log('error ',error);
        console.log('error code ',b);
      });
  };

  return {
    getCityEvents: getCityEvents,
    getCityId: getCityId,
    getCityEventsLatng : getCityEventsLatng
  };
})

.factory('ArtistInfo', function ($http){
  function getSpotifyIds(songkickId){
    return $http
      .jsonp("http://developer.echonest.com/api/v4/artist/profile?api_key=APRGVYHQGMQ5FKTYM&id=songkick:artist:"+songkickId+"&bucket=id:spotify&format=jsonp&callback=JSON_CALLBACK")
      .success(function(data) {
        console.log(data)
      })
      // .error(function(data) {console.log(data)})
  }

  function getPics(id){
    return $http
    .jsonp("http://developer.echonest.com/api/v4/artist/images?api_key=APRGVYHQGMQ5FKTYM&id=songkick:artist:"+id+"&format=jsonp&results=1&start=0&license=unknown&callback=JSON_CALLBACK")
    .success(function(data){
      console.log("services Pic Data", data)
    })
  }
    return {
      getSpotifyIds: getSpotifyIds,
      getPics: getPics
    }
})
.factory('AddToSpotify', function ($http){
   function hotTracks (artistId, cb) {
    console.log('artistId factory', artistId)
     $http.get('/hotTracks', {params :{artistId: artistId}})
     .then(function(response){
       console.log(response)
       cb(null, response);
     }, function(err){
       console.log(err)
       cb(err, null)
     })

   }
   return {
    hotTracks: hotTracks
  }
})
.factory('VenueSearch', function($http){
  function venueId(venueName){
    console.log('getting venue events')
    return $http.jsonp("http://api.songkick.com/api/3.0/search/venues.json?query="+venueName+"&apikey="+songkickKey+"&jsoncallback=JSON_CALLBACK")
    .success(function(data){
      console.log(data)
    })
  }
  function venueEvents(venueId){

     return $http.jsonp("http://api.songkick.com/api/3.0/venues/"+venueId+"/calendar.json?apikey="+songkickKey+"&jsoncallback=JSON_CALLBACK")
    .success(function(data){
      console.log('venueEvents:',data)
    })
  }
  return{
    venueId: venueId,
    venueEvents: venueEvents
  }
})
.factory('Authentication', function($http, $state){
  var isAuthenticated;

  function isAuth(intendedState){

    $http.get('/isAuthenticated')
    .then(function(response){
      if(response.data.authenticated){
        $state.go(intendedState);
        isAuthenticated = true;
      } else {
        $state.go('login');
        isAuthenticated = false;
      }
   }, function(err){
     $state.go('login');
   })

  }
  
  function logOut(){
    $http.get('/logout')
    .then(function(response){
      console.log(response)
    })
  }

  return{
    isAuth: isAuth,
    isAuthenticated: isAuthenticated,
    logOut: logOut
  }
})


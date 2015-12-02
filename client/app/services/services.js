
var echokey = 'APRGVYHQGMQ5FKTYM';
var consumerKey = 'ce78d10e8183380fb57357cc8a07e29d';
var echoSharedSecret = 'YhNZOH5TRUWGMogv/2XCZw';
var songkickKey = 'ngIhxhYsLMjkEU8y';
angular.module('jamApp.services', [])
.factory('City',['$http', '$q', function ($http, $q) {
  var jammCityIdPromise;
  var page = 1;
  var getCityEvents = function (cityId) {
    return $http.jsonp('https://api.songkick.com/api/3.0/metro_areas/'+cityId+'/calendar.json?apikey='+songkickKey+'&jsoncallback=JSON_CALLBACK&per_page=10&page='+ page++)
  };

  var getCityEventsLatng = function(lat, lng){
    return $http.jsonp('http://api.songkick.com/api/3.0/search/locations.json?location=geo:'+lat+','+lng+'&apikey='+songkickKey+'&jsoncallback=JSON_CALLBACK')
  };


  var getCityId = function(){
    jammCityIdPromise = $q(function(resolve, reject){
      
      navigator.geolocation.getCurrentPosition(function(position){
        console.log('fixing to resolve promise');
        resolve({
          lat : position.coords.latitude,
          lng : position.coords.longitude
        })
      }, function(err){
        console.log('error getting position');
        reject(err);
      });

    }).then(function(location){
      return getCityEventsLatng(location.lat, location.lng);
    }).then(function(cityInfo){
      var id = cityInfo.data.resultsPage.results.location[0].metroArea.id;
      return id;
    });
  }


  var getCity = function(){
    return jammCityIdPromise;
  }

  return {
    getCityEvents: getCityEvents,
    getCityEventsLatng : getCityEventsLatng,
    getCityId : getCityId,
    getCity : getCity
  };

}])
.factory('ArtistInfo', ['$http', function ($http){
  function getSpotifyIds(songkickId){
    return $http.jsonp('http://developer.echonest.com/api/v4/artist/profile?api_key=APRGVYHQGMQ5FKTYM&id=songkick:artist:'+songkickId+'&bucket=id:spotify&format=jsonp&callback=JSON_CALLBACK')
    .then(function(echonestData){
      console.log('echo response' , echonestData);
      var echoArrOfForeignIds;
      if(echonestData.data.response.status.code === 0 && echonestData.data.response.artist.foreign_ids){
        echoArrOfForeignIds = echonestData.data.response.artist.foreign_ids;
        return echoArrOfForeignIds.reduce(function(total, val){
          if(val.catalog === 'spotify'){
            return val.foreign_id;
          } else {
            return total;
          }
        }, '');
      } else {
        return '';
      }
    })
  }

  function getInfo(artistId){
    return $http.get('/getArtist', {params :{artistId: artistId}})
    .then(function(response){
      console.log("getArtist", response)
      return response.data;
    });
  }
  return {
    getSpotifyIds: getSpotifyIds,
    getInfo: getInfo
  }
}])
.factory('AddToSpotify', ['$http', function ($http){
  function hotTracks (artistId, cb) {
    return $http.get('/hotTracks', {params :{artistId: artistId}})
    .then(function(response){
      return response.data.status;
    });
  }

  return {
    hotTracks: hotTracks
  }

}])
.factory('VenueSearch', function($http){
  function venueId(venueName){
    return $http.jsonp('http://api.songkick.com/api/3.0/search/venues.json?query='+venueName+'&apikey='+songkickKey+'&jsoncallback=JSON_CALLBACK')
    .success(function(data){
      console.log(data)
    })
  }
  function venueEvents(venueId){
   return $http.jsonp('http://api.songkick.com/api/3.0/venues/'+venueId+'/calendar.json?apikey='+songkickKey+'&jsoncallback=JSON_CALLBACK')
   .success(function(data){
    console.log('venueEvents:',data)
  })
 }
 return{
  venueId: venueId,
  venueEvents: venueEvents
}
})
.factory('Authentication', ['$http', '$state', function($http, $state){
  var isAuthenticated;

  function isAuth(intendedState){
    console.log('isAuth');
    return $http.get('/isAuthenticated')
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
}]);


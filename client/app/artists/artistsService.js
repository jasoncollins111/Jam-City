var echokey = 'APRGVYHQGMQ5FKTYM';
var consumerKey = 'ce78d10e8183380fb57357cc8a07e29d';
var echoSharedSecret = 'YhNZOH5TRUWGMogv/2XCZw';
var songkickKey = 'ngIhxhYsLMjkEU8y';

angular.module('jamApp.services')
.factory('City', ['$http', '$q', 
  function($http, $q) {
    var jammCityIdPromise;
    var cityPage = 1;
    var getPage = function(pageNumber) {
      cityPage = pageNumber;
    };
    var getCityEvents = function(cityId) {
      console.log('cityPage:', cityPage);
      return $http.jsonp('https://api.songkick.com/api/3.0/metro_areas/' + cityId + '/calendar.json?apikey=' + songkickKey + '&jsoncallback=JSON_CALLBACK&per_page=15&page=' + cityPage++);
    };

    var getCityEventsLatng = function(lat, lng) {
      return $http.jsonp('http://api.songkick.com/api/3.0/search/locations.json?location=geo:' + lat + ',' + lng + '&apikey=' + songkickKey + '&jsoncallback=JSON_CALLBACK');
    };

    var getCityId = function() {
      jammCityIdPromise = $q(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(function(position) {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }, function(err) {
          console.log('error getting position');
          reject(err);
        });

      }).then(function(location) {
        return getCityEventsLatng(location.lat, location.lng);
      }).then(function(cityInfo) {
        var cityObj = {
          id: cityInfo.data.resultsPage.results.location[0].metroArea.id,
          displayName: cityInfo.data.resultsPage.results.location[0].metroArea.displayName
        };
        return cityObj;
      });
    };

    var getCity = function() {
      return jammCityIdPromise;
    };

    return {
      getPage: getPage,
      getCityEvents: getCityEvents,
      getCityEventsLatng: getCityEventsLatng,
      getCityId: getCityId,
      getCity: getCity
    };

  }
  ])
.factory('VenueSearch', function($http) {

  function venueId(venueName) {
    return $http.jsonp('http://api.songkick.com/api/3.0/search/venues.json?query=' + venueName + '&apikey=' + songkickKey + '&jsoncallback=JSON_CALLBACK')
    .success(function(data) {
      console.log(data);
    });
  }

  function venueEvents(venueId) {
    return $http.jsonp('http://api.songkick.com/api/3.0/venues/' + venueId + '/calendar.json?apikey=' + songkickKey + '&jsoncallback=JSON_CALLBACK&per_page=10&page=1')
    .success(function(data) {
      console.log('venueEvents:', data);
    });
  }
  return {

    venueId: venueId,
    venueEvents: venueEvents
  };
});
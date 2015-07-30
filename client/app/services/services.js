
angular.module('jamApp.services', [])

 // var echokey = 'APRGVYHQGMQ5FKTYM'
 // var consumerKey = 'ce78d10e8183380fb57357cc8a07e29d'
 // var echoSharedSecret = 'YhNZOH5TRUWGMogv/2XCZw'
 // var songkickKey = 'ngIhxhYsLMjkEU8y'
 // var city;

.factory('CityInfo', function ($http) {
  // Your code here
  /* START SOLUTION */

  var getCityId = function (city) {
  // //$.getJSON("http://api.songkick.com/api/3.0/search/locations.json?query="+city+"&apikey="+songkickKey+"&jsoncallback=?",
  //   return $http({
  //     method: 'GET',
  //     url: "http://api.songkick.com/api/3.0/search/locations.json?query="+city+"&apikey="+songkickKey+"&jsoncallback=?"
  //   .then(function (resp) {
  //     console.log(resp)
  //     return resp.data;
  //   });
  };
  var getCityEvents = function (cityId) {

  //   $.getJSON("https://api.songkick.com/api/3.0/metro_areas/"+cityId+"/calendar.json?apikey="+songkickKey+"&jsoncallback=?",

  //   return $http({
  //     method: 'GET',
  //     url: "https://api.songkick.com/api/3.0/metro_areas/"+cityId+"/calendar.json?apikey="+songkickKey+"&jsoncallback=?",
  //     data: link
  //   });
  };


  return {
    getCityEvents: getCityEvents,
    addLink: addLink
  };
  /* END SOLUTION */
})

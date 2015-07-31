
angular.module('jamApp.services', [])



.factory('CityInfo', function ($http) {
  // Your code here
  /* START SOLUTION */
  var echokey = 'APRGVYHQGMQ5FKTYM'
  var consumerKey = 'ce78d10e8183380fb57357cc8a07e29d'
  var echoSharedSecret = 'YhNZOH5TRUWGMogv/2XCZw'
  var songkickKey = 'ngIhxhYsLMjkEU8y'

  var getCityId = function (city) {
  //$.getJSON("http://api.songkick.com/api/3.0/search/locations.json?query="+city+"&apikey="+songkickKey+"&jsoncallback=?",
    return $http.jsonp("http://api.songkick.com/api/3.0/search/locations.json?query="+city+"&apikey="+songkickKey+"&jsoncallback=JSON_CALLBACK")
    .success(function (resp) {
      console.log(resp)
      var cityId = resp.resultsPage.results.location[0].metroArea.id
      // console.log(resp.data.resultsPage)
      console.log(cityId)
      getCityEvents(cityId)
    //   return resp.data;
    });
    // })
  }

  var getCityEvents = function (cityId) {

    // $.getJSON("https://api.songkick.com/api/3.0/metro_areas/"+cityId+"/calendar.json?apikey="+songkickKey+"&jsoncallback=?",

    return $http.jsonp("https://api.songkick.com/api/3.0/metro_areas/"+cityId+"/calendar.json?apikey="+songkickKey+"&jsoncallback=JSON_CALLBACK")
    .success(function(data){
      console.log('big',data)
      var events = data.resultsPage.results.event
      // var eventArray = $scope.eventName
      // console.log(events)
      // for(var i = 0; i < events.length; i++){
      //   // var artist = events[i].performance[0].artist.id
      //   eventArray.push(events[i])
      // }
      // // console.log()
      // for(var i = 0; i < eventArray.length; i++){
      //   var artist = eventArray[0].performance[0].artist.id

      // }
    })
  };

  return {
    getCityEvents: getCityEvents,
    getCityId: getCityId
  };
  /* END SOLUTION */
})

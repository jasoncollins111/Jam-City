var app = angular.module('jamApp', [
  'ngRoute'
])

// app.config(['$routeProvider',
//   function($routeProvider) {
//     $routeProvider.
//       when('/',{
//         templateUrl: 'index.html',
//         controller: 'JamController'
//       }).
//       when('/artists/:artist', {
//         templateUrl: 'artist-details.html',
//         controller: 'ArtistDetailsCtrl'
//       }).
//       otherwise({
//         redirectTo: '/'
//       })
//     $locationProvider.html5Mode(true);

//   }
// ])

app.config(['$httpProvider', function($httpProvider) {

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);


app.controller('JamController', ['$scope','$http', function($scope,$http) {
  var echokey = 'APRGVYHQGMQ5FKTYM'
  var consumerKey = 'ce78d10e8183380fb57357cc8a07e29d'
  var echoSharedSecret = 'YhNZOH5TRUWGMogv/2XCZw'
  var songkickKey = 'ngIhxhYsLMjkEU8y'
  var city;
  $scope.eventName = [];

  $scope.submit = function() {
    if($scope.text) {
      city = this.text;
      getCityId(city)
      $scope.text = '';
    }
  };

  function getEvents(cityId){
    $.getJSON("https://api.songkick.com/api/3.0/metro_areas/"+cityId+"/calendar.json?apikey="+songkickKey+"&jsoncallback=?",
      function(data){
        var events = data.resultsPage.results.event
        var eventArray = $scope.eventName
        for(var i = 0; i < events.length; i++){
          // var artist = events[i].performance[0].artist.id
          eventArray.push(events[i])
        }
        console.log('events:', $scope.eventName)
        for(var i = 0; i < eventArray.length; i++){
          var artist = eventArray[0].performance[0].artist.id

        }
          getSpotifyIds(artist)
      })
  };

  function getCityId(city){
    $.getJSON("http://api.songkick.com/api/3.0/search/locations.json?query="+city+"&apikey="+songkickKey+"&jsoncallback=?",
      function(data){
        // data is JSON response object
        var cityId = data.resultsPage.results.location[0].metroArea.id
        console.log(cityId)
        getEvents(cityId)
      });
  }
  //"http://developer.echonest.com/api/v4/artist?api_key=APRGVYHQGMQ5FKTYM&artist=songkick:artist:6833469&format=jsonp&bucket=id:musicbrainz&callback=JSON_CALLBACK"
  // var url = "http://developer.echonest.com/api/v4/artist/search?api_key=APRGVYHQGMQ5FKTYM&id=songkick:artist:6833469&format=jsonp&bucket=id:spotify&callback=JSON_CALLBACK"
  function getSpotifyIds(artist){
    $http
      //.jsonp("http://developer.echonest.com/api/v4/artist/similar?api_key=APRGVYHQGMQ5FKTYM&artist=songkick:artist:6833469&format=jsonp&callback=JSON_CALLBACK")
      //.jsonp("http://developer.echonest.com/api/v4/song/search?api_key=APRGVYHQGMQ5FKTYM&artist=songkick:artist:6833469&format=jsonp&callback=JSON_CALLBACK")
      .jsonp("http://developer.echonest.com/api/v4/artist/profile?api_key=APRGVYHQGMQ5FKTYM&id=songkick:artist:6833469&bucket=id:spotify&format=jsonp&callback=JSON_CALLBACK")
      //.jsonp("http://developer.echonest.com/api/v4/artist/news?api_key=APRGVYHQGMQ5FKTYM&id=spotify:artist:5l8VQNuIg0turYE1VtM9zV&format=jsonp&callback=JSON_CALLBACK")
      .success(function(data) {console.log(data)})
      .error(function(data) {console.log(data)});
  }

  function createAnchors(artistObjArray){
    var artist = artistObjArray[0]
  }



}]);

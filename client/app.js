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


app.controller('JamController', ['$scope','$http', function($scope,$http) {
  var echokey = 'APRGVYHQGMQ5FKTYM'
  var songkickKey = 'ngIhxhYsLMjkEU8y'
  var consumerKey = 'ce78d10e8183380fb57357cc8a07e29d'
  var echoSharedSecret = 'YhNZOH5TRUWGMogv/2XCZw'
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
      // data is JSON response object
        console.log('success',data);
        var events = data.resultsPage.results.event
        for(var i = 0; i < events.length; i++)
        $scope.eventName.push(events[i])
        console.log('events:', $scope.eventName)
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

  function getSpotifyIds(artist){
    $.getJSON("http://developer.echonest.com/api/v4/artist/search?api_key="+echokey+"&name="+artist+"&format=json&bucket=id:spotify", 
    function(data){ 
      // data is JSON response object 
      console.log(data)
    }); 
  }  
  
  function createAnchors(artistObjArray){
    var artist = artistObjArray[0]
  }
 
}]);
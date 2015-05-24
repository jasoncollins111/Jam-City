var app = angular.module('jamApp', [
  'ngRoute',
  'JamAppController'
])

// app.config(['$routeProvider',
//   function($routeProvider) {
//     $routeProvider.
//       when('/artists',{
//         templateUrl: 'artists.html',
//         controller: 'ArtistsCtrl'
//       }).
//       when('/artists/:artist', {
//         templateUrl: 'artist-details.html',
//         controller: 'ArtistDetailsCtrl'
//       }).
//       otherwise({
//         redirectTo: '/'
//       })
//   }
// ])

app.controller('JamAppController', ['$scope','$http', function($scope,$http) {
  var songkickKey='ngIhxhYsLMjkEU8y';
  var echokey = 'APRGVYHQGMQ5FKTYM';
  var consumerKey = 'ce78d10e8183380fb57357cc8a07e29d'
  var echoSharedSecret = 'YhNZOH5TRUWGMogv/2XCZw'
  var city;
  $scope.artistName = [];
  
  $scope.submit = function() {
    if($scope.text) {
      city = this.text;
      getCityId(city)
      $scope.text = '';
    }
  };
  
  function getArtists(id){
    $.getJSON("https://api.songkick.com/api/3.0/metro_areas/"+id+"/calendar.json?apikey="+songkickKey+"&jsoncallback=?",
      function(data){
      // data is JSON response object
        console.log('success',data);
        var artists = data.resultsPage.results.event
        
        $scope.artistName.push(artists[0].performance[0].displayName)
        console.log('artists:', artistName)
      }) 
  };
  
  function getCityId(city){
    $.getJSON("http://api.songkick.com/api/3.0/search/locations.json?query="+city+"&apikey="+songkickKey+"&jsoncallback=?", 
      function(data){ 
        // data is JSON response object 
        var id = data.resultsPage.results.location[0].metroArea.id
        console.log(id)
        getArtists(id)
      }); 
  }

  function getSpotifyIds(){
    $.getJSON("http://developer.echonest.com/api/v4/artist/search?api_key="+echokey+"&name=radiohead&format=json&bucket=id:spotify", 
    function(data){ 
      // data is JSON response object 
      console.log(data)

    }); 
  }  
  
  function createAnchors(artistObjArray){
    var artist = artistObjArray[0]
  
  }
 
}]);
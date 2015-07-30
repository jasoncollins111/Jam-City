angular.module('jamApp', [
  'jamApp.services'
])




.controller('JamController', function ($scope, $location, CityInfo) {

  $scope.eventName = [];
  $scope.cityId = {}
  $scope.submit = function() {
    if($scope.text) {
      city = this.text;
      CityInfo.getCityId(city)
      .then(function(data){
        console.log('data:',data)
      })
      $scope.text = '';
    }
  };

  // .controller('LinksController', function ($scope, Links) {
  // // Your code here
  // /* START SOLUTION */
  // $scope.data = {};
  // $scope.getLinks = function () {
  //   Links.getAll()
  //     .then(function (links) {
  //       $scope.data.links = links;
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // };
  // $scope.getLinks();
  /* END SOLUTION */
// });


  // function getSpotifyIds(artist){
  //   $http
  //     .jsonp("http://developer.echonest.com/api/v4/artist/profile?api_key=APRGVYHQGMQ5FKTYM&id=songkick:artist:6833469&bucket=id:spotify&format=jsonp&callback=JSON_CALLBACK")
  //     .success(function(data) {console.log(data)})
  //     .error(function(data) {console.log(data)});
  // }

  // function createAnchors(artistObjArray){
  //   var artist = artistObjArray[0]
  // }



});
//   function getCityId(city){
//     $.getJSON("http://api.songkick.com/api/3.0/search/locations.json?query="+city+"&apikey="+songkickKey+"&jsoncallback=?",
//       function(data){
//         // data is JSON response object
//         var cityId = data.resultsPage.results.location[0].metroArea.id
//         console.log(cityId)
//         getEvents(cityId)
//       });
//   }
//   function getEvents(cityId){
//     $.getJSON("https://api.songkick.com/api/3.0/metro_areas/"+cityId+"/calendar.json?apikey="+songkickKey+"&jsoncallback=?",
//       function(data){
//         var events = data.resultsPage.results.event
//         var eventArray = $scope.eventName
//         for(var i = 0; i < events.length; i++){
//           // var artist = events[i].performance[0].artist.id
//           eventArray.push(events[i])
//         }
//         console.log('events:', $scope.eventName)
//         for(var i = 0; i < eventArray.length; i++){
//           var artist = eventArray[0].performance[0].artist.id

//         }
//           getSpotifyIds(artist)
//       })
//   };
// .config(['$httpProvider', function($httpProvider) {

//         $httpProvider.defaults.useXDomain = true;
//         delete $httpProvider.defaults.headers.common['X-Requested-With'];
//     }
// ]);
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

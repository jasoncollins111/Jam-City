angular.module('jamApp', [
  'jamApp.services',
  'ui.router',
  'ngAutocomplete',
  'daterangepicker'
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

    $stateProvider
    .state('artists', {
      url: "/artists",
      templateUrl: "app/artists/artists.html"

    })
    .state('artists.artist', {
      url: '/artist',
      templateUrl: 'app/artist/artist.html',
      // controller: function($stateParams){
      //   console.log('in stateProvider')
      // }
    })
})

.run(function(){
  var geocoder = new google.maps.Geocoder();
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  }
  
  function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    codeLatLng(lat, lng)
  }

  function errorFunction(){
      alert("Geocoder failed");
  }

  function codeLatLng(lat, lng) {


  }

})
.controller('JamController', function ($scope, $location, $state, CityInfo) {
  



  $scope.options = ['establishment', '(cities)'];

  $scope.eventsList = [];
  $scope.cityId = {}
  $scope.submit = function(cb) {
    if($scope.text) {
      var city = $scope.text;
      var date = $scope.date;
      var venue = $scope.text;

      CityInfo.getCityId(city)
      .then(function(res){
        //console.log(res.data.resultsPage)
        var cityId = res.data.resultsPage.results.location[0].metroArea.id
        console.log(cityId)
        $scope.cityId.city = cityId
        return $scope.listCityEvents(cityId, cb)

      })
      $state.go('artists')
    

    }
  };
  $scope.listCityEvents = function(cityId, cb) {
    if(cityId){
      CityInfo.getCityEvents(cityId)
      .then(function(res){
        console.log(res)
        var events = res.data.resultsPage.results.event
        console.log(events);
        for(var i = 0; i < events.length; i++){
          if(events[i].performance.length > 0){
            var artist = events[i].performance[0].artist.displayName;
            $scope.eventsList.push({
              artistName: artist,
              artistId: events[i].performance[0].artist.id,
              eventDateTime: {date: events[i].start.date,
              time: events[i].start.time},
              venue: events[i].venue.displayName,
              venueId: events[i].venue.id
            })

          }
        }
        cb();
        console.log($scope.eventsList)
      })
    }
  }
  $scope.artistDeets = function(artistClicked){
    // console.log($events)
    $scope.artistClicked = artistClicked
    console.log('in ArtistDeets', artistClicked)
    $state.go('artists.artist')
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  }
  
  function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    CityInfo.getCityEventsLatng(lat, lng);
    $scope.loading = true;
    console.log('loading started');
    CityInfo.getCityEventsLatng(lat, lng)
      .then(function(data){
        console.log(data.data.resultsPage.results.location[0].metroArea.displayName);
        // console.log(data.resultsPage.results.location[0].metroArea.displayName);
        $scope.text = data.data.resultsPage.results.location[0].metroArea.displayName;
        $scope.submit(function(){
          $scope.loading = false;
          console.log('loading complete');
        });
      });
    
  }

  function errorFunction(){
      console.log("Geocoder failed");
  }


});


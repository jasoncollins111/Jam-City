angular.module('jamApp', [
  'jamApp.services',
  'ui.router',
  'ngAutocomplete',
  'ui.materialize'

  ])


.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/artists");

  $stateProvider
  .state('artists', {
    url: "/artists",
    templateUrl: "app/artists/artists.html",
    controller: 'JamController'
  })
  .state('artists.artist', {
    url: '/artist',
    templateUrl: 'app/artist/artist.html'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'login.html',
    controller: "loginController"
  })


})


.run(function($state, $http, Authentication){
  Authentication.isAuth('artists');

  })
.controller('JamController', function ($scope, $location, $state, CityInfo, AddToSpotify, ArtistInfo, VenueSearch, Authentication) {
  

  $scope.obj = {loading : true};
  $scope.options = ['establishment', '(cities)'];
  $scope.eventsList = [];
  $scope.cityId = {}

  $scope.getCity = function(city, cb) {
    console.log($scope.obj);

    CityInfo.getCityId(city)
    .then(function(res){
      var cityId = res.data.resultsPage.results.location[0].metroArea.id
      console.log(cityId)
      $scope.cityId.city = cityId
      return $scope.listCityEvents(cityId, cb)

    })
    $state.go('artists')
    $scope.obj = {loading : true};
  };

  $scope.getVenue = function(venueName){
    $scope.artistClicked = {};
    $state.go('artists')
    $scope.obj = {loading : true};
    console.log($scope.obj);

    var venueName = $scope.text
    var venueId;
    VenueSearch.venueId(venueName)
    .then(function(res){
      console.log('venue res', res)
      venueId = res.data.resultsPage.results.venue[0].id
      console.log(venueId)
      return VenueSearch.venueEvents(venueId)
      // console.log($scope.eventsList)
    }).then(function(res){
     console.log('venueEvents call returned',res)
     var events = res.data.resultsPage.results.event
     $scope.eventsList = []
     searchEvents(events)
   })
  }

  $scope.listCityEvents = function(cityId, cb) {
    if(cityId){
      CityInfo.getCityEvents(cityId)
      .then(function(res){
        console.log("res:", res)
        var events = res.data.resultsPage.results.event
        console.log(events);
        searchEvents(events)
        cb();
        console.log($scope.eventsList)

      })
    }
  }
  function searchEvents(events){
    $scope.eventsList = [];
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
    $scope.obj = {loading : false};
    console.log($scope.obj);

  }

  $scope.artistDeets = function(artistClicked){
    // console.log($events)
    $scope.artistClicked = artistClicked
    console.log('in ArtistDeets', artistClicked)
    $state.go('artists.artist')


  }

  $scope.spotify = function(artistId){
    var newId;
    console.log('app controller spotify', artistId)
    ArtistInfo.getSpotifyIds(artistId)
    .then(function(res){
      console.log('idRes',res)
      var id = res.data.response.artist.foreign_ids[0].foreign_id
      // console.log('spotifyId', id.slice(15) )
      newId = id.slice(15)
      console.log('newId', newId)

      AddToSpotify.hotTracks(newId, function(){
        console.log('hot fire added');
      });

    })
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


      var city = data.data.resultsPage.results.location[0].metroArea.displayName;
        // $scope.text = data.data.resultsPage.results.location[0].metroArea.displayName;
        $scope.getCity(city, function(){
          $scope.loading = false;
          console.log('loading complete');
        });
      });

  }

  function errorFunction(){
    console.log("Geocoder failed");
  }

  $scope.toast = function(){
    Materialize.toast('I am a toast!', 4000)
  }


})
.controller('loginController', function ($scope, $location, $state, CityInfo, AddToSpotify, ArtistInfo, VenueSearch) {
  console.log('in loginctrl');

});


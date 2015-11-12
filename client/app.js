angular.module('jamApp', [
  'jamApp.services',
  'ui.router',
  'ngAutocomplete'

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

.controller('JamController', function ($scope, $location, $state, CityInfo, AddToSpotify, ArtistInfo, VenueSearch, Authentication, $timeout) {


  $scope.obj = {loading : true};
  $scope.options = ['establishment', '(cities)'];
  $scope.eventsList = [];
  $scope.cityId = {}
  $scope.artistAdded = false

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
    var newId;
    var artistId  = artistClicked.artistId
    // console.log("id", id)

        ArtistInfo.getPics(artistId)
        .then(function(res){
          console.log('controller pic data', res.data.response.images[0].url)
          $scope.artistPic = res.data.response.images[0].url
        })


    $scope.artistClicked = artistClicked
    console.log('in ArtistDeets', artistClicked)
    $state.go('artists.artist')


  }
  $scope.logout = function(){
    Authentication.logOut()
    .then(function(res){
      console.log('logged out')
    })
  }
  $scope.spotify = function(artistId){
    var newId;
    console.log('app controller spotify', artistId)
    ArtistInfo.getSpotifyIds(artistId)
    .then(function(res){
      console.log('idRes',res)
      if(res.data.response.artist.foreign_ids){
        var id = res.data.response.artist.foreign_ids[0].foreign_id
        newId = id.slice(15)
        AddToSpotify.hotTracks(newId, function(err, response){
          console.log('hot fire added');
          if(!err){
            var songs = response.data.arrSongsAdded;
            Materialize.toast('We added ' + songs[0].artists + ' to your spotify city jams playlist', 5750);
          } else {
            Materialize.toast('We could not add to your playlist :(...', 5750);
          }
        });
      } else {
        console.log('artist doesnt exist in spotify');
        //toast
        Materialize.toast('We could not add this music to spotify', 5750);

        return;
      }
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




})
.controller('loginController', function ($scope, $location, $state, CityInfo, AddToSpotify, ArtistInfo, VenueSearch) {
  console.log('in loginctrl');

});


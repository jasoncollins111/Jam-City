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
  .state('doBetter', {
    url: '/incompatibleBrowser',
    templateUrl: 'incompatibleBrowser.html'
  })


})
.run(function($state, $http, Authentication){
  if (navigator.geolocation) {
    Authentication.isAuth('artists');
  } else {
    $state.go('doBetter');
  }
})

.controller('JamController', function ($scope, $location, $state, CityInfo, AddToSpotify, ArtistInfo, VenueSearch, Authentication, $timeout) {


  $scope.obj = {loading : true};
  $scope.eventsList = [];
  $scope.cityId = {}
  $scope.artistAdded = false

  $scope.getCity = function(city, cb) {
    CityInfo.getCityId(city)
    .then(function(res){
      var cityId = res.data.resultsPage.results.location[0].metroArea.id;
      $scope.cityId.city = cityId
      return $scope.listCityEvents(cityId, cb)
    })
    .catch(function(err){
      console.log('error getting city', err);
    })
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
        var events = res.data.resultsPage.results.event
        searchEvents(events)
        cb();
      })
      .catch(function(err){
        console.log('error getting city events', err);
      })
    }
  }
  function searchEvents(events){
    $scope.eventsList = [];
    console.log('events ', events);
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
    var artistId  = artistClicked.artistId;

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

  $scope.spotify = function(artist){
    var newId;
    var artistId = artist.artistId;
    console.log('app controller spotify', artistId)
    ArtistInfo.getSpotifyIds(artistId)
    .then(function(res){
      console.log('idRes',res)
      try{

        if(res.data.response.artist.foreign_ids){
          var id = res.data.response.artist.foreign_ids[0].foreign_id
          newId = id.slice(15)
          AddToSpotify.hotTracks(newId, function(err, response){
            console.log('hot fire added');
            if(!err){
              var songs = response.data.arrSongsAdded;
              Materialize.toast('We added ' + artist.artistName + ' to your spotify city jams playlist', 5750);
            } else {
              Materialize.toast('We could not add'+ artist.artistName + ' add to your playlist :(...', 5750);
            }
          });
        } else {
          console.log('artist doesnt exist in spotify');
          //toast
          Materialize.toast('We could not add this music to spotify', 5750);

          return;
        }
      
      } catch (err) {
        console.log('artist doesnt exist in spotify');
        Materialize.toast('We could not add this music to spotify', 5750);
      }
    })
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  } 

  function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    $scope.loading = true;
    CityInfo.getCityEventsLatng(lat, lng)
    .then(function(data){
      var city = data.data.resultsPage.results.location[0].metroArea.displayName;
      $scope.getCity(city, function(){
        $scope.loading = false;
        console.log('loading complete');
      });

    }).catch(function(err){
      console.log('error getting city lat and long');
      Materialize.toast('The site did not load properly, please refresh the page', 5750);
    });
  }




  function errorFunction(){
    console.log("Geocoder failed");
  }




})
.controller('loginController', function ($scope, $location, $state, CityInfo, AddToSpotify, ArtistInfo, VenueSearch) {
  console.log('in loginctrl');

});


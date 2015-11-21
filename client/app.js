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
    templateUrl: 'login.html'
  })
  .state('doBetter', {
    url: '/incompatibleBrowser',
    templateUrl: 'incompatibleBrowser.html'
  })


})
.run(function($state, $http, Authentication, init){
  init.cityEvents();
  if (navigator.geolocation) {
    Authentication.isAuth('artists');
  } else {
    $state.go('doBetter');
  }
})

.controller('JamController', function ($scope, $location, $state, AddToSpotify, ArtistInfo, VenueSearch, Authentication, $timeout, init) {

  $scope.obj = {loading : true};
  $scope.eventsList = [];
  $scope.cityId = {}
  $scope.artistAdded = false

  init.getCity()
  .then(function(events){
    console.log('i made it', events);
    displayEvents(events);
  });

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
    }).then(function(res){
     console.log('venueEvents call returned',res)
     var events = res.data.resultsPage.results.event
     $scope.eventsList = []
     searchEvents(events)
   })
  }

 
  function displayEvents(events){
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


});


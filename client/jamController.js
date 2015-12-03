angular.module('jamApp.controllers', [])
.controller('JamController',['$scope', '$location', '$state', 'AddToSpotify', 'ArtistInfo', 'VenueSearch', 'Authentication', '$timeout', 'City', '$window', function ($scope, $location, $state, AddToSpotify, ArtistInfo, VenueSearch, Authentication, $timeout, City, $window) {
  $scope.obj = {loading : true};
  $scope.eventsList = [];
  $scope.artistAdded = false
  
  var getCityEventsIdThenUpdateEventsList = function(){
    City.getCity()
      .then(function(id){
        return City.getCityEvents(id);
      }) 
      .then(function(events){
        console.log('in events', events);
        return events.data.resultsPage.results.event;
      })
    .then(function(events){
      console.log('city', events[0].location.city)
      $scope.city = $scope.city ? $scope.city: events[0].location.city; 
      displayEvents(events);
    });
  }

  getCityEventsIdThenUpdateEventsList();


  $scope.getVenue = function(venueName){
    $scope.artistClicked = {};
    $state.go('artists')
    $scope.obj = {loading : true};
    var venueName = $scope.text
    var venueId;
    VenueSearch.venueId(venueName)
    .then(function(res){
      venueId = res.data.resultsPage.results.venue[0].id
      return VenueSearch.venueEvents(venueId)
    }).then(function(res){
     console.log('venueEvents call returned',res)
     var events = res.data.resultsPage.results.event
     $scope.eventsList = []
     searchEvents(events)
   })
  }

  angular.element($window).bind("scroll", function(e) {
    console.log('handling scroll event');
    var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    var body = document.body;
    var html = document.documentElement;
    var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    windowBottom = windowHeight + window.pageYOffset;

    if (windowBottom >= docHeight) {
        console.log('getting some events!');
        $timeout(getCityEventsIdThenUpdateEventsList, 2500);
    }
  });

  function displayEvents(events){
    console.log('events ', events);
    $scope.eventsList = $scope.eventsList ? $scope.eventsList : [];
    var nameCache = {};
    for(var i = 0; i < events.length; i++){
      if(events[i].performance.length > 0){

        var artist = events[i].performance[0].artist.displayName;

        if(!nameCache[artist]){
          $scope.eventsList.push({
            artistName: artist,
            artistId: events[i].performance[0].artist.id,
            eventDateTime: {
              date: events[i].start.date,
              time: events[i].start.time
            },
            venue: events[i].venue.displayName,
            venueId: events[i].venue.id
            })
          nameCache[artist] =  true;
        }

      }
    }
    $scope.obj = {loading : false};
  }
  $scope.artistDeets = function(artistClicked){
    var newId;
    var artistId  = artistClicked.artistId;

    ArtistInfo.getSpotifyIds(artistId)
    .then(function(artistForeignId){
      console.log('id ', artistForeignId)
      newId = artistForeignId.slice(15);
      return ArtistInfo.getInfo(newId);
    }).then(function(info){
      if(info.status === 'found your pic bruh'){
        $scope.artistPic = info.image;
      }
      $scope.artistClicked = artistClicked;
      console.log('current state ', $state.current);
      if ($state.current.name !== 'artists.artist') {
        $state.go('artists.artist');
      }
    })
    .catch(function(err){
      $scope.artistPic = 'http://cdn.playbuzz.com/cdn/71582f18-68a6-4ff0-942d-fd7090ffafd8/d56b4878-6ccb-4ce5-8101-f76d220a51d7.jpg';
      $scope.artistClicked = artistClicked;
      console.log('in ArtistDeets', artistClicked);
      if ($state.current.name !== 'artists.artist') {
        $state.go('artists.artist');
      }
    })
  }
  $scope.logout = function(){
    Authentication.logOut()
    .then(function(res){
      console.log('logged out')
    })
  }
  $scope.spotify = function(artist){
    var artistId = artist.artistId;
    ArtistInfo.getSpotifyIds(artistId)
    .then(function(artistForeignId){
      var newId;
      if(artistForeignId === '') throw Error('no foreign Id');
      newId = artistForeignId.slice(15);
      return AddToSpotify.hotTracks(newId);
    })
    .then(function(addToSpotifyJammCityPlaylistStatus){
      if(addToSpotifyJammCityPlaylistStatus === 'tracks added!'){
        Materialize.toast('Popular music from ' + artist.artistName + ' was added to your Jamm-City playlist on Spotify', 5750);
      } else {
        throw Error('did not add to spotify');
      }
    })
    .catch(function(err){
      Materialize.toast('We could not add '+ artist.artistName + ' to your Jamm-City playlist on Spotify :(...', 5750);
    })
  };
}]);


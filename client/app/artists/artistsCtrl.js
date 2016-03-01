//Events List Controller
angular.module('jamApp.controllers')
.controller('JamEventListCtrl', ['$scope', '$state', 'ArtistInfo', 'VenueSearch', '$timeout', 'City', '$window', '$anchorScroll', '$sce', 'Authentication',

  function($scope, $state, ArtistInfo, VenueSearch, $timeout, City, $window, $anchorScroll, $sce, Authentication) {
    $scope.obj = {
      loading: true
    };
    $scope.eventsList = [];
    $scope.artistAdded = false;
    var lastCallTimeStamp = null;
    $scope.revealSong = false;
    $scope.playingSongTitle = '';
    $scope.playingArtist = ''

    $scope.$on('soundcloudSongs', function(event, songs) {
      event.preventDefault();
      makePlaylist(songs);
    });
    var currentUser = function(){
      $scope.user = Authentication.getUser();
    }
    currentUser();
    console.log('user',$scope.user)
    var makePlaylist = function(songs) {
      $scope.songs = songs[Math.floor(Math.random()*10)];
      $scope.$digest();
      $scope.playSong($scope.songs)
    }

    $scope.toggleClasses = function() {
      $scope.hideSongs = !$scope.hideSongs;
    }

    $scope.playSong = function(song) {
      var artist = song.artist.artistName;

      $scope.stream_url = $sce.trustAsResourceUrl(song.stream_url + '?client_id=0272b27b7da270dd421f928fca6c9da0');

      var track = removeArtistNameFromSong(song.title, artist)

      $scope.playingArtist = ' ' + song.artist.artistName;
      $scope.playingSongTitle = ' ' + track ;
      // $scope.revealSong = true;
      $scope.$digest();
    }

    function removeArtistNameFromSong(song, artist){
      var ind = song.toLowerCase().indexOf(artist.toLowerCase())
      song = song.split('')
      songCut = song.splice(ind, artist.length)
      return song.join('').replace(/[^a-z0-9\s]/gi,'')
    }

    var getCityEventsIdThenUpdateEventsList = function() {
      if (lastCallTimeStamp === null) {

      } else {
        if (Date.now() - lastCallTimeStamp <= 60 * 1000) {
          return {
            then: function(callback) {
              console.log('not updating');
            }
          };
        }
      }

      lastCallTimeStamp = Date.now();
      return City.getCity()
      .then(function(city) {
        $scope.city = $scope.city ? $scope.city : city.displayName;
        $scope.header = 'Artists playing near ' + $scope.city;
        return City.getCityEvents(city.id);
      })
      .then(function(events) {
        return events.data.resultsPage.results.event;
      })
      .then(function(events) {
        displayEvents(events);
        return true;
      });
    }

    getCityEventsIdThenUpdateEventsList();


    $scope.getVenue = function(venueName) {
      // $scope.artistClicked = {};
      // $state.go('artists')
      $scope.obj = {
        loading: true
      };
      var venueName = $scope.text
      var venueId;
      VenueSearch.venueId(venueName)
      .then(function(res) {
        venueId = res.data.resultsPage.results.venue[0].id
        return VenueSearch.venueEvents(venueId)
      }).then(function(res) {
        var events = res.data.resultsPage.results.event
        $scope.eventsList = []
        displayEvents(events)
        var venueName = $scope.text
        $scope.text = '';
        $scope.header = 'Artists playing at ' + venueName;
        return true;
      })
    }


    angular.element($window).bind("scroll", function(e) {

      var distanceFromTheTop = $(window).scrollTop();
      var winHeight = $window.innerHeight;
      var docHeight = $(document).height();

      if (distanceFromTheTop + winHeight >= docHeight - 200) {
        $timeout(function() {
          getCityEventsIdThenUpdateEventsList()
          .then(function() {
            $anchorScroll.yOffset = 100;
          });
        }, 1100);
      }
    });

    function displayEvents(events) {
      $scope.eventsList = $scope.eventsList ? $scope.eventsList : [];
      var nameCache = {};

      for (var i = 0; i < events.length; i++) {
        if (events[i].performance.length > 0) {

          var artist = events[i].performance[0].artist.displayName;
          var time = events[i].start.datetime !== null ? moment(events[i].start.datetime).calendar() : moment(events[i].start.date).calendar().split(' ')[0];

          if (!nameCache[artist]) {
            $scope.eventsList.push({
              artistName: artist,
              artistId: events[i].performance[0].artist.id,
              eventDateTime: {
                date: time,
                time: events[i].start.time
              },
              venue: events[i].venue.displayName,
              venueId: events[i].venue.id
            })
            nameCache[artist] = true;
          }
        }
      }
      $scope.obj = {
        loading: false
      };

    }
    $scope.artistDeets = function(artistClicked) {
      var newId;
      var artistId = artistClicked.artistId;

      ArtistInfo.getSpotifyIds(artistId)
      .then(function(artistForeignId) {
        newId = artistForeignId.slice(15);
        return ArtistInfo.getInfo(newId);
      }).then(function(info) {
        if (info.status === 'found your pic bruh') {
          $scope.artistPic = info.image;
        }
        $scope.artistClicked = artistClicked;
        if ($state.current.name !== 'artists.artist') {
          $state.go('artists.artist');
        }
      })
      .catch(function(err) {
        console.log('error',err)
        $scope.artistPic = '../../assets/jamm-city-white.png';
        console.log('artist Pic, error',$scope.artistPic)
        $scope.artistClicked = artistClicked;
        if ($state.current.name !== 'artists.artist') {
          $state.go('artists.artist');
        }
      })
    }
  }
  ]);

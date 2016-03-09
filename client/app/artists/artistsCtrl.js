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
    $scope.playingArtist = '';
    $scope.venueSearch = false;
    var venueName;
    var venueId;


    $scope.$on('soundcloudSongs', function(event, songs) {
      event.preventDefault();
      makePlaylist(songs);
    });
    var currentUser = function(){
      $scope.user = Authentication.getUser();
    }
    currentUser();
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
      $scope.$digest();
    }

    function removeArtistNameFromSong(song, artist){
      var ind = song.toLowerCase().indexOf(artist.toLowerCase())
      song = song.split('')
      songCut = song.splice(ind, artist.length)
      return song.join('').replace(/[^a-z0-9\s]/gi,'')
    }

    var getCityEventsIdThenUpdateEventsList = function() {
      City.cityPage = 1;
      if (lastCallTimeStamp && Date.now() - lastCallTimeStamp <= 60 * 100) {
        return {
          then: function(callback) {
            console.log('not updating');
          }
        };
      }
      
      lastCallTimeStamp = Date.now();

      return City.getCity()
      .then(function(city) {
        $scope.cityId = city.id;
        $scope.city = $scope.city ? $scope.city : city.displayName;
        $scope.header = 'Artists playing in ' + $scope.city;
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
    var updateEventsList = function() {
      if (lastCallTimeStamp && Date.now() - lastCallTimeStamp <= 60 * 100) {
        return {
          then: function(callback) {
            console.log('not updating');
          }
        };
      }
      lastCallTimeStamp = Date.now();
      console.log('scope city id', $scope.cityId)
      return City.getCityEvents($scope.cityId)
      .then(function(events) {
        return events.data.resultsPage.results.event;
      })
      .then(function(events) {
        console.log(events)
        displayEvents(events);
        return true;
      });
    }

    getCityEventsIdThenUpdateEventsList();
    

    $scope.getVenue = function(venue) {
      $scope.obj = {
        loading: true
      };
      venueName = $scope.text
      $scope.header = 'Artists playing at ' + venueName;
      $scope.venueSearch = true;
      VenueSearch.venueId(venueName)
      .then(function(res) {
        venueId = res.data.resultsPage.results.venue[0].id
        return VenueSearch.venueEvents(venueId)
      }).then(function(res) {
        var events = res.data.resultsPage.results.event
        $scope.eventsList = []
        displayEvents(events)
        $scope.text = '';
      })
    }
    $scope.goVenue = function(){
      console.log($state)
      venueName = $scope.text
      $state.go('jams.venue', {'venue': venueName})
      $scope.getVenue(venueName)
    }

    angular.element($window).bind("scroll", function(e) {

      var distanceFromTheTop = $(window).scrollTop();
      var winHeight = $window.innerHeight;
      var docHeight = $(document).height();
  
        if (distanceFromTheTop + winHeight >= docHeight - 300 && !$scope.venueSearch) {
          $timeout(function() {
            updateEventsList()
            .then(function() {
              $anchorScroll.yOffset = 100;
            });
          }, 1100);
        }
   
    });

    function displayEvents(events) {
      console.log('events', events)
      $scope.eventsList = $scope.eventsList ? $scope.eventsList : [];
      var nameCache = {};
      events.forEach(function(event, i){ 
        if (event.performance.length > 0) {

          var artist = event.performance[0].artist.displayName;
          var date = event.start.datetime !== null ? moment(event.start.datetime).calendar() : moment(event.start.date).calendar().split(' ')[0];
          var time = event.start.time;
          var id = event.performance[0].artist.id;
          var spotifyId;
          var venue = event.venue.displayName;
          var venueId = event.venue.id;
          
          ArtistInfo.getSpotifyIds(id, artist, time)
          .then(function(artistForeignId) {
            newId = artistForeignId.slice(15);
            return newId || 'not in spotify';
          }).then(function(result) {
            console.log('nameCache2:',nameCache)
            if(!nameCache[artist] && result !== 'not in spotify'){
              console.log('artist', artist)
              console.log('nameCache3:',nameCache)
              spotifyId = result;
              nameCache[artist] = true;
              return ArtistInfo.getInfo(result)
            } 
          })
          .then(function(info) {
            if (info) {
             $scope.eventsList.push({
               artistName: artist,
               artistId: spotifyId,
               artistpic: info.image,
               eventDateTime: {
                 date: date,
                 time: time
               },
               venue: venue,
               venueId: venueId
             })
             
            }
          })
          .catch(function(err) {
            console.log('err', err)
          })
          .then(function(){
            $scope.obj = {
              loading: false
            };
          })
          .catch(function(err) {
            console.log('error',err)
          })
        }
      })
    }
    $scope.goBack = function() {
      $scope.header = 'Artists playing in ' + $scope.city;
      $scope.venueSearch = false;
      $scope.obj = {
        loading: true
      };
      $scope.eventsList=[];
      City.getPage(1);
      updateEventsList();
      $state.go('jams');
    }
    
  }
  ]);

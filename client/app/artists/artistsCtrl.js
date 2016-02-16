angular.module('jamApp.controllers')
    .controller('JamEventListCtrl', ['$scope', '$state', 'ArtistInfo', 'VenueSearch', '$timeout', 'City', '$window', '$anchorScroll', '$sce',

        function($scope, $state, ArtistInfo, VenueSearch, $timeout, City, $window, $anchorScroll, $sce) {
            $scope.obj = {
                loading: true
            };
            $scope.eventsList = [];
            $scope.artistAdded = false
            var lastCallTimeStamp = null;
            $scope.hideSongs = false;
            $scope.playingSongTitle = '';


            $scope.$on('soundcloudSongs', function(event, songs) {
                makePlaylist(songs);
            });

            var makePlaylist = function(songs) {
                $scope.songs = songs;
                console.log($scope.songs);
                $scope.$digest();
            }

            $scope.toggleClasses = function() {
              $scope.hideSongs = !$scope.hideSongs;
            }

            $scope.playSong = function(song) {
                $scope.stream_url = $sce.trustAsResourceUrl(song.stream_url + '?client_id=0272b27b7da270dd421f928fca6c9da0');
                $scope.playingSongTitle = song.title;
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
                        return City.getCityEvents(city.id);
                    })
                    .then(function(events) {
                        console.log('in events', events);
                        return events.data.resultsPage.results.event;
                    })
                    .then(function(events) {
                        displayEvents(events);
                        return true;
                    });
            }

            getCityEventsIdThenUpdateEventsList();


            $scope.getVenue = function(venueName) {
                $scope.artistClicked = {};
                $state.go('artists')
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
                        console.log('venueEvents call returned', res)
                        var events = res.data.resultsPage.results.event
                        $scope.eventsList = []
                        searchEvents(events)
                    })
            }


            angular.element($window).bind("scroll", function(e) {

                var distanceFromTheTop = $(window).scrollTop();
                var winHeight = $window.innerHeight;
                var docHeight = $(document).height();

                if (distanceFromTheTop + winHeight >= docHeight - 100) {
                    $timeout(function() {
                        getCityEventsIdThenUpdateEventsList()
                            .then(function() {
                                $anchorScroll.yOffset = 100;
                            });
                    }, 1500);
                }
            });

            function displayEvents(events) {
                console.log('events ', events);
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
                        console.log('id ', artistForeignId)
                        newId = artistForeignId.slice(15);
                        return ArtistInfo.getInfo(newId);
                    }).then(function(info) {
                        if (info.status === 'found your pic bruh') {
                            $scope.artistPic = info.image;
                        }
                        $scope.artistClicked = artistClicked;
                        console.log('current state ', $state.current);
                        if ($state.current.name !== 'artists.artist') {
                            $state.go('artists.artist');
                        }
                    })
                    .catch(function(err) {
                        $scope.artistPic = 'http://cdn.playbuzz.com/cdn/71582f18-68a6-4ff0-942d-fd7090ffafd8/d56b4878-6ccb-4ce5-8101-f76d220a51d7.jpg';
                        $scope.artistClicked = artistClicked;
                        console.log('in ArtistDeets', artistClicked);
                        if ($state.current.name !== 'artists.artist') {
                            $state.go('artists.artist');
                        }
                    })
            }
        }
    ]);

angular.module('jamApp.controllers')
    .controller('JamArtistCtrl', ['$scope', 'AddToSpotify', 'ArtistInfo',
        function($scope, AddToSpotify, ArtistInfo) {
            $scope.obj = {
                loading: true
            };
            $scope.eventsList = [];
            $scope.artistAdded = false;

            SC.initialize({
                client_id: '0272b27b7da270dd421f928fca6c9da0'
            });

            $scope.spotify = function(artist) {
                var artistId = artist.artistId;
                AddToSpotify.hotTracks(artistId)
                    .then(function(addToSpotifyJammCityPlaylistStatus) {
                        if (addToSpotifyJammCityPlaylistStatus === 'tracks added!') {
                            Materialize.toast('Popular music from ' + artist.artistName + ' was added to your Jamm-City playlist on Spotify', 5750);
                        } else {
                            throw Error('did not add to spotify');
                        }
                    })
                    .catch(function(err) {
                        Materialize.toast('We could not add ' + artist.artistName + ' to your Jamm-City playlist on Spotify :(...', 5750);
                    });
            };

            $scope.soundCloud = function(event, artist) {
                event.preventDefault();
                var artistId = artist.artistId;
                SC.get('/tracks', {
                    q: artist.artistName
                }, function(songs) {
                    songs.sort(function(a, b) {
                        return b.playback_count - a.playback_count;
                    });
                    songs = songs.map(function(song) {
                        return {
                            artist: artist,
                            title: song.title,
                            stream_url: song.stream_url
                        };
                    });
                    $scope.$emit('soundcloudSongs', songs);
                });
            };
        }
    ]);
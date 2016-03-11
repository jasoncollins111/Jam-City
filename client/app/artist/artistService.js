angular.module('jamApp.services')

.factory('ArtistInfo', ['$http',
    function($http) {
        function getSpotifyIds(songkickId) {
            return $http.jsonp('http://developer.echonest.com/api/v4/artist/profile?api_key=5UIASXPAXN5VPD0PN&id=songkick:artist:' + songkickId + '&bucket=id:spotify&format=jsonp&callback=JSON_CALLBACK')
                .then(function(echonestData) {
                    var echoArrOfForeignIds;
                    if (echonestData.data.response.status.code === 0 && echonestData.data.response.artist.foreign_ids) {
                        echoArrOfForeignIds = echonestData.data.response.artist.foreign_ids;
                        return echoArrOfForeignIds.reduce(function(total, val) {
                            if (val.catalog === 'spotify') {
                                return val.foreign_id;
                            } else {
                                return total;
                            }
                        }, '');
                    } else {
                        return '';
                    }
                });

        }

        function getInfo(artistId) {
            return $http.get('/getArtist', {
                    params: {
                        artistId: artistId
                    }
                })
                .then(function(response) {
                    return response.data;
                });
        }
        return {
            getSpotifyIds: getSpotifyIds,
            getInfo: getInfo
        };
    }
])
    .factory('AddToSpotify', ['$http',
        function($http) {
            function hotTracks(artistId, cb) {
                return $http.get('/hotTracks', {
                        params: {
                            artistId: artistId
                        }
                    })
                    .then(function(response) {
                        return response.data.status;
                    });
            }
            return {
                hotTracks: hotTracks
            };

        }
    ]);
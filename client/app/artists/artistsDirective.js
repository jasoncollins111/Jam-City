angular.module('jamApp')
    .directive('ajaxImg', ['$http', 'ArtistInfo',
        function($http, ArtistInfo, $compile) {
            var defaultImg = 'http://cdn.playbuzz.com/cdn/71582f18-68a6-4ff0-942d-fd7090ffafd8/d56b4878-6ccb-4ce5-8101-f76d220a51d7.jpg';
            return {
                scope: {
                    artistId: "=ajaxImg",
                    src: '=ngSrc'
                },
                link: function(scope, element, attrs, controllers) {
                    ArtistInfo.getSpotifyIds(scope.artistId)
                        .then(function(artistForeignId) {
                            newId = artistForeignId.slice(15);
                            return ArtistInfo.getInfo(newId);
                        }).then(function(info) {
                            if (info.status === 'found your pic bruh') {
                                attrs.$set('ngSrc', info.image);
                            }
                        })
                        .catch(function(err) {
                            attrs.$set('ngSrc', defaultImg);
                        })
                }

            };
        }
    ]);
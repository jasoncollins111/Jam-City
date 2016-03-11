angular.module('jamApp.controllers', [])
    .controller('JamMainCtrl', ['$scope', '$location', '$state', 'AddToSpotify', 'ArtistInfo', 'VenueSearch', 'Authentication', '$timeout', 'City', '$window', '$anchorScroll',
        function($scope, $location, $state, AddToSpotify, ArtistInfo, VenueSearch, Authentication, $timeout, City, $window, $anchorScroll) {
            $scope.obj = {
                loading: true
            };
            $scope.eventsList = [];
            $scope.artistAdded = false;


            $scope.logout = function() {
                Authentication.logOut()
                    .then(function(res) {
                        console.log('logged out');
                    });
            };
        }
    ]);
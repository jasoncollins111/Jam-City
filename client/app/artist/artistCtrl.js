
angular.module('jamApp.controllers')
.controller('JamArtistCtrl',['$scope', '$location', '$state', 'AddToSpotify', 'ArtistInfo', 'VenueSearch', 'Authentication', '$timeout', 'City', '$window', '$anchorScroll',function ($scope, $location, $state, AddToSpotify, ArtistInfo, VenueSearch, Authentication, $timeout, City, $window, $anchorScroll) {
  $scope.obj = {loading : true};
  $scope.eventsList = [];
  $scope.artistAdded = false


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


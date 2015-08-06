angular.module('jamApp', [
  'jamApp.services'
])




.controller('JamController', function ($scope, $location, CityInfo) {

  $scope.eventsList = [];
  $scope.cityId = {}
  $scope.submit = function() {
    if($scope.text) {
      city = this.text;
      CityInfo.getCityId(city)
      .then(function(res){
        //console.log(res.data.resultsPage)
        var cityId = res.data.resultsPage.results.location[0].metroArea.id
        console.log(cityId)
        $scope.cityId.city = cityId
        return $scope.listCityEvents(cityId)

      })
      $scope.text = '';
    }
  };
  $scope.listCityEvents = function(cityId) {
    if(cityId){
      CityInfo.getCityEvents(cityId)
      .then(function(res){
        console.log(res)
        var events = res.data.resultsPage.results.event
        for(var i = 0; i < events.length; i++){
          var artist = events[i].performance[0].artist.displayName
          $scope.eventsList.push({
            artistName: artist,
            artistId: events[i].performance[0].artist.id,
            eventDateTime: {date: events[i].start.date,
            time: events[i].start.time},
            venue: events[i].venue.displayName,
            venueId: events[i].venue.id
          })
        }
        console.log($scope.eventsList)
      })
    }
  }
});


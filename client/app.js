angular.module('jamApp', [
  'jamApp.services',
  'jamApp.controllers',
  'ui.router'
  ])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/artists');
  $stateProvider
  .state('artists', {
    url: '/artists',
    templateUrl: 'app/artists/artists.html',
    controller: 'JamEventListCtrl'
  })
  .state('artists.artist', {
    url: '/artist',
    templateUrl: 'app/artist/artist.html'
  })
  .state('doBetter', {
    url: '/incompatibleBrowser',
    templateUrl: 'app/static/incompatibleBrowser.html'
  })
})
.run(['$state', '$http', 'Authentication', 'City', function($state, $http, Authentication, City){
  City.getCityId();
  if (navigator.geolocation) {
    Authentication.isAuth('artists');
  } else {
    $state.go('doBetter');
  }
}])

.directive('preloader', function() {
  return {
    templateUrl: 'app/static/preloader.html'
  };
})


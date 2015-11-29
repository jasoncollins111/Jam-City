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
    controller: 'JamController'
  })
  .state('artists.artist', {
    url: '/artist',
    templateUrl: 'app/artist/artist.html'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'login.html'
  })
  .state('doBetter', {
    url: '/incompatibleBrowser',
    templateUrl: 'incompatibleBrowser.html'
  })
})
.run(['$state', '$http', 'Authentication', 'init', function($state, $http, Authentication, init){
  init.cityEvents();
  if (navigator.geolocation) {
    Authentication.isAuth('artists');
  } else {
    $state.go('doBetter');
  }
}])

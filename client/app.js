angular.module('jamApp', [
  'jamApp.services',
  'jamApp.controllers',
  'ui.router'
  ])
.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/jams');
  $stateProvider
  .state('jams', {
    url: '/jams',
    templateUrl: 'app/artists/artists.html',
    controller: 'JamEventListCtrl'
  })
  .state('jams.venue', {
    url: '/:venue',
    templateUrl: 'app/artists/artists.html',
    controller: 'JamEventListCtrl'
  })
  .state('doBetter', {
    url: '/incompatibleBrowser',
    templateUrl: 'app/static/incompatibleBrowser.html'
  })
  $locationProvider.html5Mode(true);
})
.run(['$state', '$http', 'Authentication', 'City', function($state, $http, Authentication, City){
  City.getCityId()
  if (navigator.geolocation) {
    Authentication.isAuth();
  } else {
    $state.go('doBetter');
  }
}])

.directive('preloader', function() {
  return {
    templateUrl: 'app/static/preloader.html'
  };
})


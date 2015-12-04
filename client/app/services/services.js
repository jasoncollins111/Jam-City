
angular.module('jamApp.services', [])
.factory('Authentication', ['$http', '$state', function($http, $state){
  var isAuthenticated;

  function isAuth(intendedState){
    console.log('isAuth');
    return $http.get('/isAuthenticated')
    .then(function(response){
      if(response.data.authenticated){
        $state.go(intendedState);
        isAuthenticated = true;
      } else {
        $state.go('login');
        isAuthenticated = false;
      }
    }, function(err){
     $state.go('login');
   })
  }

  function logOut(){
    $http.get('/logout')
    .then(function(response){
      console.log(response)
    })
  }
  return{
    isAuth: isAuth,
    isAuthenticated: isAuthenticated,
    logOut: logOut
  }
}]);

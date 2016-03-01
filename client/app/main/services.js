
angular.module('jamApp.services', [])
.factory('Authentication', ['$http', '$state', function($http, $state){
  var isAuthenticated;
  var user;
  function isAuth(intendedState){
    return $http.get('/isAuthenticated')
    .then(function(response){
      if(response.data.isAuthenticated.authenticated){
        console.log('authentication', response)
        $state.go(intendedState);
        isAuthenticated = true;
        user = response.data.userInfo;
      } else {
        $state.go('login');
        isAuthenticated = false;
      }
    }, function(err){
     $state.go('login');
   })
  }
  function getUser(){
    return user 
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
    logOut: logOut,
    getUser: getUser
  }
}]);


angular.module('shortly.services', [])

.factory('getArtists', function ($http) {
  // Your code here
  /* START SOLUTION */
  var getCityId = function () {
    return $http({
      method: 'GET',
      url: '/api/links'
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var getEvents = function (link) {
    return $http({
      method: 'POST',
      url: '/api/links',
      data: link
    });
  };

  return {
    getAll: getAll,
    addLink: addLink
  };
  /* END SOLUTION */
})

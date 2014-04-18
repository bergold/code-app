var ghHome = angular.module('ghHome', ['ngAnimate']);

ghHome.factory('board', function($q, $http) {
  return {
    getStories: function() {
      var deferred = $q.defer();
      $http.get('board.json').success(function(data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    }
  };
});

ghHome.controller('ReposCtrl', function($scope, board) {
  $scope.board = [];
  repos.getStories().then(function(s) {
    $scope.board = s;
  });
});

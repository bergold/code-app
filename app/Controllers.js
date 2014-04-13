/*
 * File: Controllers.js
 * Controllers
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


codesocket.controller('ProjectsCtrl', function($scope, project) {
    $scope.projects = [];
    project.list().then(function(projects) {
        angular.forEach(projects, function(val, key) {
            $scope.projects.push(angular.extend({}, val, {name: key}));
        });
    });
});

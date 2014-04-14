/*
 * File: Controllers.js
 * Controllers
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */

codesocket.controller('MainCtrl', function($scope, tabs) {
    
});

codesocket.controller('FiletreeCtrl', function($scope, tabs, util) {
    function update() {
        tabs.getFiletree().then(function(ft) {
            $scope.tree = ft;
        });
    }
    
    $scope.cssIcon = function(fname) {
        return util.getFileIcon(fname);
    };
    $scope.toggleDir = function(dir) {
        dir.open = !dir.open;
    };
    
    $scope.$on('projectchanged', update);
});

codesocket.controller('EditorCtrl', function($scope) {
    var elm = angular.element("#editor");
    var cm  = CodeMirror(elm[0], {
        lineNumbers: true
    });
});

codesocket.controller('ProjectsCtrl', function($scope, project) {
    $scope.projects = [];
    project.list().then(function(projects) {
        angular.forEach(projects, function(val, key) {
            $scope.projects.push(angular.extend({}, val, {name: key}));
        });
    });
});

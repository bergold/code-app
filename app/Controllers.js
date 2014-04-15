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

codesocket.controller('FilesCtrl', function($scope, tabs, util) {
    function update() {
        $scope.files = tabs.files.all();
        angular.forEach($scope.files, function(f, i) {
            f.index = i;
            f.clean = f.doc.isClean();
        });
    }
    
    $scope.files = [];
    
    $scope.cssIcon = function(fname) {
        return util.getFileIcon(fname);
    };
    
    $scope.selectfile = function(file) {
        tabs.files.select(file.index);
    };
    
    $scope.$on('activefilechanged', update);
    $scope.$on('fileschanged', update);
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
    
    $scope.openfile = function(file) {
        tabs.files.open(file);
    };
    
    $scope.$on('projectchanged', update);
});

codesocket.controller('EditorCtrl', function($scope) {
    var elm = angular.element("#editor");
    var cm  = CodeMirror(elm[0], {
        lineNumbers: true
    });
    $scope.$on('activefilechanged', function(e, i, f) {
        cm.swapDoc(f.doc);
    });
});

codesocket.controller('ProjectCtrl', function($scope, tabs) {
    $scope.project = "Kein Projekt gew&auml;hlt";
    $scope.$on('projectchanged', function() {
        $scope.project = tabs.getProject().getLabel();
    });
});

codesocket.controller('ProjectsCtrl', function($scope, tabs, project) {
    $scope.projects = [];
    project.list().then(function(projects) {
        angular.forEach(projects, function(val, key) {
            $scope.projects.push(angular.extend({}, val, {name: key}));
        });
    });
});

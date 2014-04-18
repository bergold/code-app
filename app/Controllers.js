/*
 * File: Controllers.js
 * Controllers
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */

codesocket.controller('MainCtrl', function($scope, tabs, util) {
    
    $scope.util = util;
    
    
    // editor controll point
    var elm = angular.element("#editor");
    var cm  = CodeMirror(elm[0], {
        lineNumbers: true
    });
    cm.on('change', function() {
        tabs.files.check();
        $scope.$digest();
    });
    tabs.onfile(function(doc) {
        cm.swapDoc(doc);
    });
    
    
    // files controll point
    $scope.files = tabs.files.all;
    
    $scope.openfile = function(entry) {
        tabs.files.open(entry);
    };
    $scope.selectfile = function(file) {
        tabs.files.select(file.index);
    };
    $scope.savefile = function(file) {
        tabs.files.save(file.index).then(function() {
            console.log("save", "success");
        }, function() {
            console.log("save", "error");
        });
    };
    $scope.closefile = function() {
        
    };
    
    
    // project controll point
       // $scope.project = null;
    
});

codesocket.controller('FiletreeCtrl', function($scope, tabs, util) {
    function update() {
        tabs.getFiletree().then(function(ft) {
            $scope.tree = ft;
        });
    }
    
    $scope.toggleDir = function(dir) {
        dir.open = !dir.open;
    };
    
    $scope.openfile = function(file) {
        tabs.files.open(file);
    };
    
    $scope.$on('projectchanged', update);
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

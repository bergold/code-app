/*
 * File: Controllers.js
 * Controllers
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */

codesocket.controller('MainCtrl', function($scope, $rootScope, tabs, util) {
    
    $scope.util = util;
    
    
    // editor controll point
    var elm = angular.element("#editor");
    var cm  = CodeMirror(elm[0], {
        lineNumbers: true,
        readOnly:    true
    });
    cm.on('change', function() {
        tabs.files.check();
        $scope.$digest();
    });
    tabs.onfile(function(doc) {
        if (false!==doc) {
            cm.setOption('readOnly', false);
            cm.swapDoc(doc);
        } else {
            cm.setOption('readOnly', true);
            cm.swapDoc(new CodeMirror.Doc('', ''));
        }
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
        var pr = tabs.files.save(file.index).then(function() {
            return {
                msg: "File saved",
                type: "success"
            };
        }, function() {
            return {
                msg: "File save failed",
                type: "error"
            };
        });
        $rootScope.$broadcast('notify', {
            msg: "Saving file",
            type: "process",
            promise: pr
        });
    };
    $scope.closefile = function(file) {
        tabs.files.close(file.index);
    };
    
});

codesocket.controller('FiletreeCtrl', function($scope, $rootScope, tabs, util) {
    function update() {
        var pr = tabs.getFiletree().then(function(ft) {
            $scope.tree = ft;
            return undefined;
        });
        $rootScope.$broadcast('notify', {
            msg: "Loading FileTree",
            type: "process",
            promise: pr
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

codesocket.controller('NotiferCtrl', function($scope, $rootScope, $timeout) {
    $scope.notifications = [];
    function update() {
        angular.forEach($scope.notifications, function(a, i) {
            a.index = i;
        });
    }
    function add(data) {
        $scope.notifications.push(data);
        update();
        if (angular.isDefined(data.promise)) {
            data.promise.then(function(msg) {
                msg && add(msg);
                close(data);
            });
        } else {
            var duration = data.duration || 2000;
            $timeout(close.bind(null, data), duration, false);
        }
    }
    function close(d) {
        update();
        $scope.notifications.splice(d.index, 1);
    }
    $scope.close = close;
    $rootScope.$on('notify', function(evt, data) {
        add(data);
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

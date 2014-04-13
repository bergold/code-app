/*
 * File: app.js
 * Main entry point
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


var codesocket = angular.module('codesocket', ['ngAnimate']);

// public app functions
codesocket.run(function($rootScope) {
    $rootScope.close = function() {
        chrome.app.window.current().close();
    }
    $rootScope.maximize = function() {
        chrome.app.window.current().isMaximized() ? chrome.app.window.current().restore() : chrome.app.window.current().maximize();
    };
    $rootScope.minimize = function() {
        chrome.app.window.current().minimize();
    }
});

// project functions
codesocket.run(function($rootScope, storage, project) {
    $rootScope.selectproject = function(pname) {
        project.open(pname).then(function(p) {
            tabs.setProject(p);
            storage.set({lastproject:pname});
            $rootScope.$broadcast('projectchanged', p);
        });
    };
});

// start app lifecycle
codesocket.run(function($rootScope, storage) {
    storage.get("lastproject").then(function(pname) {
        if (pname = pname.lastproject) {
            $rootScope.selectproject(pname);
        }
    });
});

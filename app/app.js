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

// init the app
codesocket.run(function() {
    
});

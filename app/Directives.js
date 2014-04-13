/*
 * File: Directives.js
 * Directives
 *
 * @author: Emil Bergold
 * @version: 1.0
 *
 */


codesocket.directive('csMenu', function($document, $rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.on('click', function(evt) {
                var data = angular.extend({
                    tpl: "app/partials/menu." + attrs.csMenu + ".html",
                }, element.offset());
                data.top  += element.height() - 10;
                data.left += 15;
                data["max-height"] = ($document.height() - data.top - 80) + "px";
                $rootScope.$broadcast('openMenu', data);
                evt.stopPropagation();
            });
        }
    }
});


codesocket.directive('csMenu', function($rootScope, $compile, $http, $templateCache) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            function loadTpl(tpl) {
                $http.get(tpl, {cache: $templateCache}).success(function(html) {
                    element.html($compile(html)(scope));
                });
            }
            
            $rootScope.$on('openMenu', function(e, data) {
                function wrapperClick(evt) {
                    scope.menuUrl = undefined;
                    element.removeClass("active").html('');
                    angular.element(".wrapper").off("click", wrapperClick);
                };
                
                loadTpl(data.tpl);
                element.addClass("active").css({
                    'top':        data.top,
                    'left':       data.left,
                    'max-height': data['max-height']
                });
                angular.element(".wrapper").on("click", wrapperClick);
            });
        }
    }
});


codesocket.directive('csWindow', function() {
    return {
        restrict: 'E',
        
    }
});



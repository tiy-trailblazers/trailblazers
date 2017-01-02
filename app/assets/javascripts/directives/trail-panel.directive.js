(function() {
    'use strict';

    angular.module('trailblazer')
        .directive('tandcDetail', TrailPanelDirective);

    function TrailPanelDirective() {
        return {
            restrict: 'A',
            transclude: true,
            template: '<article><header>Detail</header><section ng-transclude></section></article>'
        };
    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .directive('trail', TrailPanelDirective);

    function TrailPanelDirective() {
        return {
            restrict: 'A',
            scope: {
                dataTitle: '='
            },
            transclude: true
        };
    }
}());

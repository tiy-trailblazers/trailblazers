(function() {
    'use strict';

    angular.module('trailblazer')
        .directive('trailpanel', TrailPanelDirective);

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

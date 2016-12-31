(function() {
    'use strict';

    angular.module('trailblazer')
        .filter('length', LengthFilter);

    function LengthFilter() {

        return function length(trails) {
            var trailSort = trails.sort(function sortLength(a, b) {
                if (a.length > b.length) {
                    return -1;
                } else {
                    return 1;
                }
            });
            return trailSort;
        };
    }
}());

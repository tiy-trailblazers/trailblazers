(function() {
    'use strict';

    angular.module('trailblazer')
        .filter('class', ClassFilter);

    function ClassFilter() {

        return function classFilter(trail) {
            if (trail.name === null) {
                return;
            }
            var className = trail.name.split(' ');
            className = className.join('-');
            return className;
        };
    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .filter('class', ClassFilter);

    function ClassFilter() {

        return function classFilter(trail) {
            var className = trail.name.split(' ');
            className = className.join('-');
            return className;
        };
    }
}());

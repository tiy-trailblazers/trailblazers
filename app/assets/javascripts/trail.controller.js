(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TrailController', TrailController);

    TrailController.$inject = [ 'MapService' ];

    function TrailController(){

        var vm = this;
        vm.trails = function createTrails(trails) {
            vm.trails = trails;
        };


    }
}());

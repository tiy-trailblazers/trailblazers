(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TrailandCampgroundController', TrailandCampgroundController);

    TrailandCampgroundController.$inject = [ '$stateParams', 'TrailandCampgroundService' ];

    function TrailandCampgroundController($stateParams, TrailandCampgroundService) {
        var vm = TrailandCampgroundService;
        vm.trails = {};
        console.log($stateParams);
    }
}());

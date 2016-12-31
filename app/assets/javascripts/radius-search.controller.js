(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('RadiusSearchController', RadiusSearchController);

    RadiusSearchController.$inject = [ '$state', '$stateParams', 'TrailandCampgroundService' ];

    function RadiusSearchController($state, $stateParams, TrailandCampgroundService) {
        var vm = this;
        vm.coordinates = $stateParams.transCoords;
        vm.trails = null;
        vm.campground = null;
        vm.getTrails = TrailandCampgroundService.findTrails(vm.coordinates)
            .then(function transformData(data) {
                vm.trails = data.trails;
                vm.campgrounds = data.campgrounds;
                $state.go('trails-and-campgrounds', {centerCoords: $stateParams.centerCoords, trails: vm.trails, campgrounds: vm.campgrounds });
            })
            .catch(function errHandler(err) {
                console.log(err);
            });

    }

}());

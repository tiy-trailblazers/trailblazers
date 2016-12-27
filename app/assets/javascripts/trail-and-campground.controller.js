(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TrailandCampgroundController', TrailandCampgroundController);

    TrailandCampgroundController.$inject = [ '$state', '$stateParams', 'TrailandCampgroundService' ];

    function TrailandCampgroundController($state, $stateParams, TrailandCampgroundService) {
        var vm = this;
        vm.coordinates = $stateParams.transCoords;
        vm.trails = null;
        vm.campground = null;
        vm.getTrails = TrailandCampgroundService.findTrails(vm.coordinates)
            .then(function transformData(data) {
                console.log(data);
                vm.trails = data.trails;
                vm.campgrounds = data.campgrounds;
                $state.go('trails-and-campgrounds', {centerCoords: $stateParams.centerCoords, trails: vm.trails, campgrounds: vm.campgrounds });
                $stateParams.trails = vm.trails;
                $stateParams.campgrounds = vm.campgrounds;
            })
            .catch(function errHandler(err) {
                console.log(err);
            });

    }

}());

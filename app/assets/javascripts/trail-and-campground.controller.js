(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TrailandCampgroundController', TrailandCampgroundController);

    TrailandCampgroundController.$inject = [ '$stateParams', 'TrailandCampgroundService' ];

    function TrailandCampgroundController($stateParams, TrailandCampgroundService) {
        var vm = this;
        vm.coordinates = $stateParams.obj;
        vm.trails = null;
        vm.campground = null;
        vm.getTrails = TrailandCampgroundService.findTrails(vm.coordinates)
            .then(function transformData(data) {
                console.log(data);
                vm.trails = data.trails;
                vm.campgrounds = data.campgrounds;
            });

    }

}());

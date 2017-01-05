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
        vm.getTandC = TrailandCampgroundService.findTsandCs(vm.coordinates)
            .then(function transformData(data) {
                vm.trails = data.trails;
                vm.campgrounds = data.campgrounds;
                window.sessionStorage.setItem('TsandCs', angular.toJson({trails: data.trails, campgrounds: data.campgrounds}));
            })
            .catch(function errHandler(err) {
                console.log(err);
            });

        vm.noSignin = function noSignin() {
            $state.go('trails-and-campgrounds', {centerCoords: $stateParams.centerCoords, trails: vm.trails, campgrounds: vm.campgrounds });
        };

        vm.signin = function signin() {
            $state.go('signin');
        };

    }

}());

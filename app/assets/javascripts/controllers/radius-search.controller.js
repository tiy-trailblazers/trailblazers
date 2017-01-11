(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('RadiusSearchController', RadiusSearchController);

    RadiusSearchController.$inject = [ '$state', '$stateParams', '$rootScope', 'TrailandCampgroundService' ];

    function RadiusSearchController($state, $stateParams, $rootScope, TrailandCampgroundService) {
        var vm = this;
        vm.coordinates = $stateParams.transCoords;
        vm.trails = null;
        vm.campground = null;
        vm.getTandC = TrailandCampgroundService.findTsandCs(vm.coordinates)
            .then(function transformData(data) {
                vm.trails = data.trails;
                vm.campgrounds = data.campgrounds;
                $rootScope.TsandCs = angular.toJson({trails: data.trails, campgrounds: data.campgrounds, centerCoords: $stateParams.centerCoords});
                //sessionStorage.setItem('TsandCs', angular.toJson({trails: data.trails, campgrounds: data.campgrounds, centerCoords: $stateParams.centerCoords || JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords, transCoords: $stateParams.transCoords || JSON.parse(sessionStorage.getItem('TsandCs')).transCoords}));
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

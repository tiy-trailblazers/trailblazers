(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TripController', TripController);

    TripController.$inject = [ '$scope', '$state', '$rootScope', 'TrailandCampgroundService', 'TripService' ];

    function TripController($scope, $state, $rootScope, TrailandCampgroundService, TripService) {
        var vm = this;
        vm.tripCreate = null;
        vm.trip = {};
        vm.tsORcs = TripService.tsORcs;
        vm.madeSearch = null;
        vm.search = null;
        vm.searchValues = {};

        vm.submitSearch = function submitSearch(searchValues) {
            TrailandCampgroundService.findTsandCsSearchForm(searchValues)
                .then(function success(data) {
                    var center = ol.proj.fromLonLat([ data.longitude, data.latitude]);
                    $rootScope.TsandCs = angular.toJson({trails: data.trails, campgrounds: data.campgrounds, centerCoords: center, transCoords: null});
                    $state.go('trails-and-campgrounds', {centerCoords: center, trails: data.trails, campgrounds: data.campgrounds });
                })
                .catch(function error(err){
                    console.log(err);
                });
        };

        vm.newSearchForm = function newSearchForm() {
            vm.search = true;
        };

        vm.createTrip = function createTrip() {
            vm.tripCreate = true;
        };

        vm.postTrip = function postTrip(trip) {
            TripService.postTrip(trip)
            .then(function success(data) {
                sessionStorage.setItem('trip', angular.toJson(data));
                $state.go('trip', {id: data.trip.id, trip:data});
                vm.trip = {};
                vm.tripCreate = null;
            });
        };

        vm.newSearch = function newSearch() {
            $rootScope.searched =  null;
            $rootScope.TsandCs = null;
            $state.go('home');
        };

        $rootScope.$watch('searched', function() {
            if($rootScope.searched) {
                console.log('in if');
                vm.madeSearch = true;
            } else {
                vm.madeSearch = false;
            }
        });

    }
}());

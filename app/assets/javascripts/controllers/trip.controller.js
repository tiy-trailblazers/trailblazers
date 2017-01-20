(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TripController', TripController);

    TripController.$inject = [ '$scope', '$state', '$rootScope', 'TrailandCampgroundService', 'TripService' ];

    function TripController($scope, $state, $rootScope, TrailandCampgroundService, TripService) {
        var vm = this;
        vm.trip = {};
        vm.tsORcs = TripService.tsORcs;
        vm.madeSearch = null;
        vm.searchValues = {};

        vm.submitSearch = function submitSearch(searchValues) {
            TrailandCampgroundService.findTsandCsSearchForm(searchValues)
                .then(function success(data) {
                    vm.searchValues = {};
                    $state.go('trails-and-campgrounds', {trails: data.trails, campgrounds: data.campgrounds });
                })
                .catch(function error(err){
                    console.log(err);
                });
        };

        vm.postTrip = function postTrip(trip) {
            TripService.postTrip(trip)
            .then(function success(data) {
                vm.tsORcs = TripService.clearTsorCs();
                vm.trip = {};
                $state.go('trip', {id: data.trip.id, trip:data});
            });
        };

        vm.newSearch = function newSearch() {
            vm.tsORcs = TripService.clearTsorCs();
            $rootScope.searched =  null;
            $state.go('home');
        };

        $rootScope.$watch('searched', function() {
            if($rootScope.searched   || JSON.parse(sessionStorage.getItem('TsandCs'))) {
                vm.madeSearch = true;
            } else {
                vm.madeSearch = false;
            }
        });

    }
}());

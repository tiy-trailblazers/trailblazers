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
            TrailandCampgroundService.findTsandCsSearchForm(searchValues);
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
            sessionStorage.removeItem('TsandCs');
            $state.go('home');
        };

        $rootScope.$watch('searched', function() {
            if($rootScope.searched || JSON.parse(sessionStorage.getItem('TsandCs'))) {
                console.log('in if');
                vm.madeSearch = true;
            } else {
                vm.madeSearch = false;
            }
        });

    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TripController', TripController);

    TripController.$inject = [ '$scope', '$state', '$rootScope', 'TripService' ];

    function TripController($scope, $state, $rootScope, TripService) {
        var vm = this;
        vm.tripCreate = null;
        vm.trip = {};
        vm.plannedTrip = null;
        vm.tsORcs = TripService.tsORcs;
        vm.madeSearch = null;

        vm.createTrip = function createTrip() {
            vm.tripCreate = true;
        };

        vm.postTrip = function postTrip(trip) {
            TripService.postTrip(trip)
            .then(function success(data) {
                vm.plannedTrip = data;
                sessionStorage.setItem('trip', angular.toJson(data));
                $state.go('trip', {id: data.trip.id, trip:data});
            });
        };

        vm.newSearch = function newSearch() {
            vm.madeSearch =  null;
            sessionStorage.removeItem('TsandCs');
            $state.go('home');
        };

        $rootScope.$watch('searched', function() {
            if($rootScope.searched) {
                vm.madeSearched = true;
            }
        });

    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TripController', TripController);

    TripController.$inject = [ '$scope', '$stateParams', 'TripService' ];

    function TripController($scope, $stateParams, TripService) {
        var vm = this;
        vm.tripCreate = null;
        vm.trip = {};
        vm.tsORcs = TripService.tsORcs;
        vm.signedIn = null;

        vm.createTrip = function createTrip() {
            vm.tripCreate = true;
        };

        vm.postTrip = function postTrip(trip) {
            TripService.postTrip(trip);
        };
    }
}());

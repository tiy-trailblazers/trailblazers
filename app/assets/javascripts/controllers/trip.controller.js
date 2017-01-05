(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TripController', TripController);

    TripController.$inject = [ 'TripService' ];

    function TripController(TripService) {
        var vm = this;
        vm.tripCreate = null;
        vm.trip = {};
        vm.tsORcs = TripService.tsORcs;
        vm.signedIn = JSON.parse(sessionStorage.getItem('userToken')) || null;


        vm.createTrip = function createTrip() {
            vm.tripCreate = true;
        };
    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TripController', TripController);

    TripController.$inject = [ '$scope', '$stateParams', 'TripService' ];

    function TripController($scope, $stateParams, TripService) {
        console.log('new trip');
        var vm = this;
        vm.tripCreate = null;
        vm.trip = {};
        vm.tsORcs = TripService.tsORcs;
        vm.signedIn = null;

        vm.createTrip = function createTrip() {
            vm.tripCreate = true;
        };

        function tokenSearch() {
            var token = setInterval(function() {
                console.log('running');
                if (!JSON.parse(sessionStorage.getItem('userToken'))) {
                    return;
                } else {
                    clearInterval(token);
                    $scope.$apply(function() {
                        vm.signedIn = true;
                    });
                }
            }, 1000);
        }

        tokenSearch();
        console.log(vm.signedIn);
    }
}());

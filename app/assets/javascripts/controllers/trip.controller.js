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
        vm.madeSearch = null;
        vm.search = null;

        vm.createTrip = function createTrip() {
            vm.tripCreate = true;
        };

        vm.postTrip = function postTrip(trip) {
            TripService.postTrip(trip);
        };

        vm.newSearchForm = function newSearchForm() {
            vm.search = !vm.search;
        };

        function TandCSearch() {
            var TandC = setInterval(function() {
                if (!JSON.parse(sessionStorage.getItem('TsandCs'))) {
                    return;
                } else {
                    clearInterval(TandC);
                    $scope.$apply(function() {
                        vm.madeSearch = true;
                    });
                }
            }, 1000);
        }

        TandCSearch();
    }
}());

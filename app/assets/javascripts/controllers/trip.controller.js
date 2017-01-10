(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TripController', TripController);

    TripController.$inject = [ '$scope', '$state', 'TripService' ];

    function TripController($scope, $state, TripService) {
        var vm = this;
        vm.tripCreate = null;
        vm.trip = {};
        vm.plannedTrip = null;
        vm.tsORcs = TripService.tsORcs;
        vm.madeSearch = null;
        vm.search = null;

        vm.createTrip = function createTrip() {
            vm.tripCreate = true;
        };

        vm.postTrip = function postTrip(trip) {
            TripService.postTrip(trip)
            .then(function success(data) {
                vm.plannedTrip = data;
                window.sessionStorage.setItem('trip', angular.toJson(data));
                $state.go('trip', {id: data.trip.id, trip:data});
            });
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

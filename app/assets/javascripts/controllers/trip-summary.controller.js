(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TripSummaryController', TripSummaryController);

    TripSummaryController.$inject = ['$stateParams'];

    function TripSummaryController($stateParams) {
        var vm = this;

        console.log($stateParams);

        vm.trip = $stateParams.trip ||  JSON.parse(sessionStorage.getItem('trip'));

    }
}());

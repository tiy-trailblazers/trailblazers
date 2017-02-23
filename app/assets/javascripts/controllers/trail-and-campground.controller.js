(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TrailandCampgroundController', TrailandCampgroundController);

    TrailandCampgroundController.$inject = ['$scope', '$stateParams', '$rootScope', 'TripService', 'TrailandCampgroundService'];

    function TrailandCampgroundController($scope, $stateParams, $rootScope, TripService, TrailandCampgroundService) {
        var vm = this;

        //vm.trails = $stateParams.trails || JSON.parse(sessionStorage.getItem('TsandCs')).trails || null;
        //vm.campgrounds = $stateParams.campgrounds || JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds || null;
        //vm.center = $stateParams.centerCoords || JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords || null;
        vm.element = null;
        vm.markerElement = null;
        vm.searchForm = {};

        vm.search = function findTsandCs(formData) {
            formData.coordinates = $rootScope.coordinates;
            console.log(formData);
            TrailandCampgroundService.nada = null;
        };

        vm.trailPopup = function trailPopup(element){
            vm.element = element;
        };

        vm.addTrip = function addTrip(tripItem) {
            TripService.addTorCtoTrip(tripItem);
        };

        vm.addMapClickedPopup = function addMapClickedPopup() {
            TripService.addMapClickedPopup();
        };
    }

}());

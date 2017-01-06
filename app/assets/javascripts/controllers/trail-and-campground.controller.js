(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TrailandCampgroundController', TrailandCampgroundController);

    TrailandCampgroundController.$inject = ['$stateParams', 'TripService'];

    function TrailandCampgroundController($stateParams, TripService) {
        var vm = this;

        vm.trails = $stateParams.trails || JSON.parse(sessionStorage.getItem('TsandCs')).trails;
        vm.campgrounds = $stateParams.campgrounds || JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds;
        vm.element = null;
                                        
        vm.trailPopup = function trailPopup(element){
            vm.element = element;
        };

        vm.addTrip = function addTrip(tripItem) {
            console.log(tripItem);
            TripService.addTorCtoTrip(tripItem);
        };
    }

}());

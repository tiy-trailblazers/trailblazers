(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TrailandCampgroundController', TrailandCampgroundController);

    TrailandCampgroundController.$inject = ['$stateParams'];

    function TrailandCampgroundController($stateParams) {
        var vm = this;

        vm.trails = $stateParams.trails;
        vm.campgrounds = $stateParams.campgrounds;
        vm.element = null;

        vm.trailPopup = function trailPopup(element){
            vm.element = element;
        };

        vm.addToTrip = function addToTrip(tripItem) {
            console.log(tripItem);
        };
    }

}());

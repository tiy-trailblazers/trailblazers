(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('CampgroundController', CampgroundController);

    function CampgroundController(){

        var vm = this;
        vm.campgrounds = function createCampgrounds(campgrounds) {
                vm.campgrounds = campgrounds;
        };




    }
}());

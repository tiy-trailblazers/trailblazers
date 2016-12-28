(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TrailandCampgroundController', TrailandCampgroundController);

    TrailandCampgroundController.$inject = ['$stateParams'];

    function TrailandCampgroundController($stateParams) {
        var vm = this;

        vm.trails = $stateParams.trails;
        vm.campgrounds = $stateParams.campgrounds;
    }

}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TrailandCampgroundController', TrailandCampgroundController);

    TrailandCampgroundController.$inject = ['$stateParams'];

    function TrailandCampgroundController($stateParams) {
        var vm = this;

        vm.trails = $stateParams.trails;
        vm.campgrounds = $stateParams.campgrounds;
        vm.trailClick = false;

        vm.trailPopup = function trailPopup(event){
            if( vm.trailClick === true ){
                vm.trailClick = false;
                console.log('false');
                return;
            }
            console.log(event);
            vm.trailClick = true;
        };
    }

}());

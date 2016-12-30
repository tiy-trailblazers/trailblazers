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
        vm.element = null;

        vm.trailPopup = function trailPopup(event){
            if( vm.trailClick === true ){
                vm.trailClick = false;
                vm.element = null;
                console.log('false');
                return;
            } else {
                console.log(event);
                vm.trailClick = true;
                vm.element = event.srcElement.innerText.split(' ').join('-');
                console.log(vm.element);
            }
        };
    }

}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('TrailandCampgroundController', TrailandCampgroundController);

    TrailandCampgroundController.$inject = ['$scope', '$stateParams', 'TripService'];

    function TrailandCampgroundController($scope, $stateParams, TripService) {
        var vm = this;

        vm.trails = $stateParams.trails || JSON.parse(sessionStorage.getItem('TsandCs')).trails;
        vm.campgrounds = $stateParams.campgrounds || JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds;
        vm.element = null;
        vm.markerElement = null;

        vm.trailPopup = function trailPopup(element){
            console.log(element);
            vm.element = element;
        };

        vm.addTrip = function addTrip(tripItem) {
            console.log('add trip from popup', tripItem);
            TripService.addTorCtoTrip(tripItem);
        };

        vm.addMapClickedPopup = function addMapClickedPopup() {
            TripService.addMapClickedPopup();
        };

        // $scope.$watch('popupelmClicked', function(){
        //     console.log($scope.popupelmClicked);
        //     if ($scope.popupelmClicked === undefined) {
        //         console.log('watch undefined');
        //         return;
        //     } else {
        //         var tORcObj = JSON.parse($scope.popupelmClicked);
        //         vm.markerElement = tORcObj;
        //         console.log('change OBj', tORcObj);
        //     }
        // });
    }

}());

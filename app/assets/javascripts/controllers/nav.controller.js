(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('NavController', NavController);

    NavController.inject = ['$timeout', '$rootScope', '$state', 'TrailandCampgroundService'];

    function NavController($timeout, $rootScope, $state, TrailandCampgroundService) {
        var vm = this;
        vm.signedIn = null;
        vm.searched = null;
        vm.hasSearched = null;
        vm.searchValues = {};

        vm.submitSearch = function submitSearch(searchValues) {
            TrailandCampgroundService.findTsandCsSearchForm(searchValues)
                .then(function success(data) {
                    var center = ol.proj.fromLonLat(data.center);
                    //sessionStorage.setItem('TsandCs', angular.toJson({trails: data.trails, campgrounds: data.campgrounds, centerCoords: center, transCoords: null}));
                    $state.go('trails-and-campgrounds', {centerCoords: center, trails: data.trails, campgrounds: data.campgrounds });
                })
                .catch(function error(err){
                    console.log(err);
                });
        };

        vm.signingIn = function signinIn() {
            vm.signedIn = true;
        };

        $rootScope.$watch('user', function() {
            if($rootScope.user) {
                vm.signedIn = true;
            }
            else {
                console.log('in else');
                vm.signedIn = null;
            }
        });

        vm.newSearch = function newSearch() {
            vm.hasSearched =  null;
            $rootScope.TsandCs = null;
            $state.go('home');
        };

        $rootScope.$watch('searched', function() {
            if($rootScope.searched) {
                vm.hasSearched = true;
            } else {
                vm.hasSearched = null;
            }
        });
    }
}());

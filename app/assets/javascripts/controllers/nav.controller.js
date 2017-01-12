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
                    $state.go('trails-and-campgrounds', {centerCoords: data.center, trails: data.trails, campgrounds: data.campgrounds });
                })
                .catch(function error(err){
                    console.log(err);
                });
        };

        $rootScope.$watch('user', function() {
            console.log('nav checking user');
            if($rootScope.user || JSON.parse(sessionStorage.getItem('user'))) {
                vm.signedIn = true;
            }
            else {
                vm.signedIn = null;
            }
        });

        vm.newSearch = function newSearch() {
            $rootScope.searched = null;
            $state.go('home');
        };

        $rootScope.$watch('searched', function() {
            if($rootScope.searched || JSON.parse(sessionStorage.getItem('TsandCs'))) {
                vm.hasSearched = true;
            } else {
                vm.hasSearched = null;
            }
        });
    }
}());

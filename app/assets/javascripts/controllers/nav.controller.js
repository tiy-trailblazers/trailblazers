(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('NavController', NavController);

    NavController.inject = ['$timeout', '$rootScope', '$state'];

    function NavController($timeout, $rootScope, $state) {
        var vm = this;
        vm.signedIn = null;
        vm.searched = null;
        vm.hasSearched = null;

        vm.signingIn = function signinIn() {
            vm.signedIn = true;
        };

        $rootScope.$watch('user', function() {
            console.log('watching user');
            if($rootScope.user) {
                console.log('user found');
                vm.signedIn = true;
            }
            else {
                console.log('in else');
                vm.signedIn = null;
            }
        });

        vm.newSearch = function newSearch() {
            vm.hasSearched =  null;
            window.sessionStorage.removeItem('TsandCs');
            $state.go('home');
        };

        $rootScope.$watch('searched', function() {
            console.log('watching for search');
            if($rootScope.searched) {
                console.log('search found');
                vm.hasSearched = true;
            }
        });
    }
}());

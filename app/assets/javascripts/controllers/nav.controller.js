(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('NavController', NavController);

    NavController.inject = ['$timeout'];

    function NavController($timeout) {
        var vm = this;
        vm.signin = null;

        vm.signingIn = function signinIn() {
            vm.signin = !vm.signin;
        };

        vm.timer = function timer() {
            $timeout(vm.signingIn, 60000);
            return true;
        };
    }
}());

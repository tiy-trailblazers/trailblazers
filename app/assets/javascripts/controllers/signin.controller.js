(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('SigninController', SigninController);

    SigninController.$inject = [ 'UserService' ];

    function SigninController(UserService){
        var vm = this;
        vm.user = {};
        vm.userCreate = false;

        vm.createUser = function createUser(user) {
            UserService.createUser(user);
            vm.user = {};
            vm.userCreate = false;
        };

        vm.signin = function signin(user) {
            UserService.signinUser(user);
            vm.user = {};
        };

        vm.userCreateSwitch = function userCreateSwitch() {
            vm.userCreate = !vm.userCreate;
        };
    }
}());

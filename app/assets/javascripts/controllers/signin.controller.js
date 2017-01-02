(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('SigninController', SigninController);

    SigninController.$inject = [ 'UserService' ];

    function SigninController(){
        var vm = this;
        vm.user = {};

        vm.createUser = function createUser(user) {
            console.log(user);
        };

        vm.signin = function signin(user) {
            console.log(user);
        };
    }
}());

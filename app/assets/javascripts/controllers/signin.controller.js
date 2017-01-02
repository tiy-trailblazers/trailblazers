(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('SigninController', SigninController);

    SigninController.$inject = [ 'UserService', '$state' ];

    function SigninController(UserService, $state){
        var vm = this;
        vm.user = {};
        vm.userCreate = false;

        vm.userAccount = function userAccount(user) {
            if (Object.keys(user).length === 2) {
            UserService.signinUser(user)
                .then( function success(data) {
                    $state.go('profile', {
                        id: data.id,
                        user_name: '' + data.first_name + ' ' + data.last_name
                    });
                })
                .catch( function error(err) {
                    console.log(err);
                });
                vm.user = {};
                vm.userCreate = false;
            } else {
                UserService.createUser(user)
                    .then( function success(data) {
                        $state.go('profile', {
                            id: data.id,
                            user_name: '' + data.first_name + ' ' + data.last_name
                        });
                    })
                    .catch( function error(err) {
                        console.log(err);
                    });
            }
            vm.user = {};
            vm.userCreate = false;
        };

        vm.userCreateSwitch = function userCreateSwitch() {
            vm.userCreate = !vm.userCreate;
        };
    }
}());

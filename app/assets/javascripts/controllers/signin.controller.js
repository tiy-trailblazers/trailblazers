(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('SigninController', SigninController);

    SigninController.$inject = [ 'UserService', '$state' ];

    function SigninController(UserService, $state){
        var vm = this;
        vm.user = {};
        vm.userCreate = false;
        vm.message = null;

        vm.userAccount = function userAccount(user) {
            if (Object.keys(user).length === 2) {
            UserService.signinUser(user)
                .then( function success(data) {
                    console.log(data);
                    if(data.error){
                        vm.message = data.error;
                        return;
                    }
                    sessionStorage.setItem('userToken', angular.toJson(data.token));
                    $state.go('trails-and-campgrounds', {
                        user_token: data.token,
                        centerCoords: JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords,
                        trails: JSON.parse(sessionStorage.getItem('TsandCs')).trails,
                        campgrounds: JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds,
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
                        sessionStorage.setItem('userToken', angular.toJson(data.token));
                        $state.go('trails-and-campgrounds', {
                            user_token: data.token,
                            centerCoords: JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords,
                            trails: JSON.parse(sessionStorage.getItem('TsandCs')).trails,
                            campgrounds: JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds,
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

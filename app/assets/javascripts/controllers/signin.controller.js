(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('SigninController', SigninController);

    SigninController.$inject = [ '$state', '$rootScope', 'Upload', 'UserService' ];

    function SigninController( $state, $rootScope, Upload, UserService ){
        var vm = this;
        vm.user = {};
        vm.userCreate = false;
        vm.message = null;
        vm.avatar = null;
        vm.avatarUrl = null;

        vm.convertAvatar = function convertAvatar(avatar) {
            Upload.base64DataUrl(avatar).then(function(url){
                vm.avatarUrl = url;
            });
        };

        vm.userAccount = function userAccount(user, img) {
            if (!img) {
            UserService.signinUser(user)
                .then( function success(data) {
                    if(data.error){
                        vm.message = data.error;
                        return;
                    } else if (!$rootScope.searched) {
                        $state.go('home', {token: data.token});
                    } else {
                        sessionStorage.setItem('userToken', angular.toJson(data.token));
                        $state.go('trails-and-campgrounds', {
                            user_token: data.token,
                            centerCoords: JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords,
                            trails: JSON.parse(sessionStorage.getItem('TsandCs')).trails,
                            campgrounds: JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds,
                        });
                    }
                })
                .catch( function error(err) {
                    console.log(err);
                });
                vm.user = {};
                vm.userCreate = false;
            } else {
                UserService.createUser(user, img)
                    .then( function success(data) {
                        if(data.error){
                            vm.message = data.error;
                            return;
                        } else if (!$rootScope.searched) {
                            $state.go('home');
                        } else {
                            sessionStorage.setItem('userToken', angular.toJson(data.token));
                            $state.go('trails-and-campgrounds', {
                                user_token: data.token,
                                centerCoords: JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords,
                                trails: JSON.parse(sessionStorage.getItem('TsandCs')).trails,
                                campgrounds: JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds,
                            });
                        }
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

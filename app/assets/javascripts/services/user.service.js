(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('UserService', UserService);

    UserService.$inject = [ '$http', '$rootScope' ];

    function UserService($http, $rootScope) {

        return {
            createUser: createUser,
            signinUser: signinUser,
            signoffUser: signoffUser
        };

        function createUser(user, img) {
            img = angular.toJson(img);
            return $http({
                url: '/users',
                method: 'POST',
                data: {
                    user: {
                        first_name: user.firstname,
                        last_name: user.lastname,
                        email: user.email,
                        profile_image: user.avatar,
                        street: user.address,
                        city: user.city,
                        state: user.state,
                        zip: user.zip,
                        password: user.password,
                        password_confirmation: user.passwordConf,
                        avatar: img
                    }
                }
            })
            .then(function success(response) {
                sessionStorage.setItem('user', angular.toJson(response.data));
                $rootScope.user = true;
                return response.data;
            });
        }

        function signinUser(user) {
            return $http({
                url: '/session',
                method: 'POST',
                data: {
                    email: user.username,
                    password: user.password,
                }
            })
            .then(function success(response) {
                sessionStorage.setItem('user', angular.toJson(response.data));
                $rootScope.user = true;
                return response.data;
            });
        }

        function signoffUser() {
            return $http({
                url: '/session',
                method: 'DELETE'
            })
            .then(function success() {
                sessionStorage.removeItem('TsandCs');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('userToken');
                sessionStorage.removeItem('trip');
                $rootScope.user = null;
                $rootScope.searched = null;
            });
        }
    }
}());

(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('UserService', UserService);

    UserService.$inject = [ '$http', '$state' ];

    function UserService($http) {

        return {
            createUser: createUser,
            signinUser: signinUser
        };

        function createUser(user) {
            return $http({
                url: '/users',
                method: 'POST',
                data: {
                    user: {
                        first_name: user.firstname,
                        last_name: user.lastname,
                        email: user.email,
                        password: user.password,
                        password_confirmation: user.passwordConf
                    }
                }
            })
            .then(function success(response) {
                window.sessionStorage.setItem('userToken', angular.toJson(response.data.token));
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
                window.sessionStorage.setItem('userToken', angular.toJson(response.data.token));
                return response.data;
            });
        }
    }
}());

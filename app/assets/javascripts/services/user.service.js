(function() {
    'use strict';

    angular.module('trailblazer')
        .factory('UserService', UserService);

    UserService.$inject = [  ];

    function UserService() {

        return {
            createUser: createUser,
            signinUser: signinUser
        };

        function createUser(user) {
            console.log('service', user);
        }

        function signinUser(user) {
            console.log('service', user);
        }
    }
}());

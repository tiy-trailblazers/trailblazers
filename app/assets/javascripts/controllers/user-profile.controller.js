(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [  '$scope', '$state', '$rootScope', 'UserService' ];

    function UserProfileController($scope, $state, $rootScope, UserService) {
        var vm = this;
        vm.user = JSON.parse(sessionStorage.getItem('user'));
        vm.signedIn = null;

        vm.signOff = function signOff() {
            UserService.signoffUser()
            .then(function success() {
                vm.user = null;
                $('#map')[0].style.height = '100vh';
                $state.go('home');
            })
            .catch(function error(err) {
                console.log(err);
            });
        };

        $rootScope.$watch('user', function() {
            if($rootScope.user || JSON.parse(sessionStorage.getItem('user'))) {
                vm.signedIn = true;
            }
            else {
                vm.signedIn = null;
            }
        });
    }
}());

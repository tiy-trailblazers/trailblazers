(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [  '$scope', '$state', 'UserService' ];

    function UserProfileController($scope, $state, UserService) {
        var vm = this;
        vm.user = null;

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

        function tokenSearch() {
            var token = setInterval(function() {
                if (!JSON.parse(sessionStorage.getItem('user'))) {
                    return;
                } else {
                    clearInterval(token);
                    $scope.$apply(function() {
                        vm.user = JSON.parse(sessionStorage.getItem('user'));
                    });
                }
            }, 1000);
        }

        tokenSearch();
    }
}());

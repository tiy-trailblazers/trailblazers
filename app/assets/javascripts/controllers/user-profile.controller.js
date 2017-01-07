(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [  '$scope', '$stateParams' ];

    function UserProfileController($scope) {
        var vm = this;
        vm.user = null;

        vm.signOff = function signOff() {

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

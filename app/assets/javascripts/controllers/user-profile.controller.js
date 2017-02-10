(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [  '$scope', '$state', '$rootScope', 'Upload', 'UserService' ];

    function UserProfileController($scope, $state, $rootScope, Upload, UserService) {
        var vm = this;
        vm.user = JSON.parse(sessionStorage.getItem('user'));
        vm.signedIn = null;
        vm.avatar = null;

        if (vm.user) {
            vm.avatar = Upload.dataUrltoBlob(vm.user.profile_image, 'prof');
        }

        vm.signOff = function signOff() {
            UserService.signoffUser()
            .then(function success() {
                $state.go('home');
            })
            .catch(function error(err) {
                console.log(err);
            });
        };

        $rootScope.$watch('user', function() {
            if($rootScope.user || JSON.parse(sessionStorage.getItem('user'))) {
                vm.signedIn = true;
                vm.user = JSON.parse(sessionStorage.getItem('user'));
                vm.avatar = Upload.dataUrltoBlob(vm.user.profile_image, 'prof');
            }
            else {
                vm.signedIn = null;
            }
        });
    }
}());

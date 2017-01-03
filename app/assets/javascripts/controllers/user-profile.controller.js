(function() {
    'use strict';

    angular.module('trailblazer')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [ '$stateParams' ];

    function UserProfileController($stateParams) {
        var vm = this;
        console.log($stateParams);
        vm.user = $stateParams.user_name;
    }
}());

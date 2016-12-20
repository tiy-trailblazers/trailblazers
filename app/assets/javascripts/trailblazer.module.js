(function() {
    'use strict';

    angular.module('trailblazer', ['ui-router'])
        .config('viewConfig');

    viewConfig.$inject = [ '$statProvider', '$urlRouterProvider' ];

    function viewConfig($stateProvider, $urlRouterProvider) {

       $urlRouterProvider.when('', '/');

       $stateProvider
       .state({
         name: 'map',
         url: '/',
         templateUrl:'templates/map.template.html'
        });

    }


}());

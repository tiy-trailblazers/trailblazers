(function() {
    'use strict';

    angular.module('trailblazer', [  'openlayers-directive', 'ngSanitize', 'ui.router'])
        .config(viewConfig);

    viewConfig.$inject = [ '$stateProvider', '$urlRouterProvider' ];

    function viewConfig($stateProvider, $urlRouterProvider) {

       $urlRouterProvider.when('', '/');

       $stateProvider
        .state({
            name: 'trails-and-campgrounds',
            url: '/trails-and-campgrounds',
            templateUrl: 'templates/trails-and-campgrounds.template.html'
        });

    }



}());

(function() {
    'use strict';

    angular.module('trailblazer', [  'openlayers-directive', 'ngSanitize', 'ui.router'])
        .config(viewConfig);

    viewConfig.$inject = [ '$stateProvider', '$urlRouterProvider' ];

    function viewConfig($stateProvider, $urlRouterProvider) {

       $urlRouterProvider.when('', '/');

       $stateProvider
       .state({
           name: 'home',
           url: '/',
           templateUrl: 'templates/home.template.html',
       })
       .state({
           name: 'trails-and-campgrounds',
           url: '/trails-and-campgrounds',
           templateUrl: 'templates/trails-and-campgrounds.template.html',
           controller: 'TrailandCampgroundController',
           controllerAs: 'TandC',
           params: {
               centerCoords: null,
               trails: null,
               campgrounds: null,
           }
       })
       .state({
           name: 'buffer',
           url: '/buffering',
           templateUrl: 'templates/buffering.template.html',
           controller: 'RadiusSearchController',
           controllerAs: 'radius',
           params: {
               transCoords: null,
               centerCoords: null
           }
       });

    }



}());

(function() {
    'use strict';

    angular.module('trailblazer', [  'openlayers-directive', 'ngSanitize', 'ui.router', 'ngFileUpload' ])
        .config(viewConfig);

    viewConfig.$inject = [ '$stateProvider', '$locationProvider', '$urlRouterProvider' ];

    function viewConfig($stateProvider, $locationProvider, $urlRouterProvider) {

       $urlRouterProvider.when('', '/');
       $locationProvider.hashPrefix('');

       $stateProvider
       .state({
           name: 'home',
           url: '/',
           templateUrl: 'templates/home.template.html',
           params: {
               token: null
           }
       })
       .state({
           name: 'trails-and-campgrounds',
           url: '/trails-and-campgrounds',
           templateUrl: 'templates/trails-and-campgrounds.template.html',
           controller: 'TrailandCampgroundController',
           controllerAs: 'TandC',
           params: {
               user_token: null,
               centerCoords: null,
               trails: null,
               campgrounds: null
           }
       })
       .state({
           name: 'buffer',
           url: '/buffering',
           templateUrl: 'templates/buffering.template.html',
           controller: 'RadiusSearchController',
           controllerAs: 'buffer',
           params: {
               transCoords: null,
               centerCoords: null
           }
       })
       .state({
           name: 'signin',
           url: '/signin',
           templateUrl: 'templates/signin.template.html',
           controller: 'SigninController',
           controllerAs: 'signin'
       })
       .state({
           name: 'trip',
           url: '/trip-summary/:id',
           templateUrl: 'templates/trip-summary.template.html',
           controller: 'TripSummaryController',
           controllerAs: 'tripSum',
           params: {
               id: null,
               trip: null,
           }
       });
    }
}());

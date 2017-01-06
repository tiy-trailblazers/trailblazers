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
               centerCoords: checkSessionStorage('center'),
               trails: checkSessionStorage('trails'),
               campgrounds: checkSessionStorage('campgrounds')
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
           name: 'profile',
           url: '/profile/:id',
           templateUrl: 'templates/profile.template.html',
           controller: 'UserProfileController',
           controllerAs: 'user',
           params: {
               id: null,
               user_name: null
           }
       });

       function checkSessionStorage(param) {
           if(JSON.parse(sessionStorage.getItem('TsandCs')) && param === 'center') {
               return JSON.parse(sessionStorage.getItem('TsandCs')).centerCoords;
           } else if(JSON.parse(sessionStorage.getItem('TsandCs')) && param === 'trails') {
               return JSON.parse(sessionStorage.getItem('TsandCs')).trails;
           } else if(JSON.parse(sessionStorage.getItem('TsandCs')) && param === 'campgrounds') {
               return JSON.parse(sessionStorage.getItem('TsandCs')).campgrounds;
           } else {
               return null;
           }
       }

    }



}());

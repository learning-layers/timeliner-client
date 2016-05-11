'use strict';

angular.module('timelinerApp').config(function($stateProvider, $urlRouterProvider){

  // For any unmatched url, send to /
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: {
        $title: function() { return 'Welcome'; }
      }
    })
    .state('about', {
      url: '/about',
      templateUrl: 'views/about.html',
      resolve: {
        $title: function() { return 'About'; }
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      resolve: {
        $title: function() { return 'Log in'; }
      }
    })
    .state('confirm', {
      url: '/confirm/:key',
      templateUrl: 'views/confirmation.html',
      controller: 'ConfirmationCtrl',
      resolve: {
        $title: function() { return 'Complete your profile'; }
      }
    });

});

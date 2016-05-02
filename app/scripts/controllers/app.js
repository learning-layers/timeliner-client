'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('AppCtrl', function ($scope, AuthService) {
    $scope.isLoggedIn = function() {
      return AuthService.isLoggedIn();
    };

    if ( AuthService.isLoggedIn() && !AuthService.getCurrentUser() ) {
      AuthService.me(function(response) {
        AuthService.setCurrentUser(response.user);
      }, function(response) {
        console.error('Loading ME failed', response);
      });
    }
  });

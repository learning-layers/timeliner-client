'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('NavbarCtrl', function ($scope, $state, AuthService) {
    $scope.logout = function() {
      AuthService.removeAuthCookie();
      $state.go('home');
    };

    $scope.getCurrentUserName = function() {
      var currentUser = AuthService.getCurrentUser();

      if (currentUser) {
        return currentUser.name.first + ' ' + currentUser.name.last;
      }

      return '@unknwon';
    };
  });

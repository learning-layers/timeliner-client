'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('NavbarCtrl', function ($scope, $state, AuthService, UsersService) {
    $scope.logout = function() {
      AuthService.removeAuthCookie();
      $state.go('home');
    };

    $scope.manage = function() {
      $state.go('manage.overview');
    };

    $scope.getCurrentUserName = function() {
      var currentUser = AuthService.getCurrentUser();

      if (currentUser) {
        return UsersService.getFullName(currentUser);
      }

      return '@unknown';
    };
  });

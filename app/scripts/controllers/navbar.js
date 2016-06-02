'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('NavbarCtrl', function ($scope, $state, AuthService, UsersService, $translate) {
    $scope.logout = function() {
      AuthService.removeAuthCookie();
      $state.go('home');
    };
    
    $scope.changeLanguage = function (lang) {
      $translate.use(lang);
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

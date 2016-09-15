'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('AppCtrl', function ($rootScope, $scope, AuthService, SystemMessagesService, UsersService) {
    $scope.isLoggedIn = function() {
      return AuthService.isLoggedIn();
    };

    $scope.isAdminLoggedIn = function() {
      return AuthService.isAdminLoggedIn();
    };

    if ( AuthService.isLoggedIn() && !AuthService.getCurrentUser() ) {
      AuthService.me(function(response) {
        AuthService.setCurrentUser(response.data);
        $rootScope.$broadcast('$tlCurrentUserLoaded');
      }, function(error) {
        // TODO Check if more meaningful message could be shown based on response
        // Remove the console.error() call
        console.error('Loading ME failed', error);
        SystemMessagesService.showError('Could not load currently logged in user data!');
      });
    }

    $scope.getUserFullName = function(user) {
      return UsersService.getFullName(user);
    };

    $scope.getUserImage = function(user) {
      return UsersService.getImage(user);
    };
  });

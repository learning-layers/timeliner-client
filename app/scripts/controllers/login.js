'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('LoginCtrl', function ($scope, AuthService) {
    $scope.updating = false;
    $scope.model = {};

    // TODO This has to be moved to some better place
    $scope.isLoggedIn = function() {
      return AuthService.isLoggedIn();
    };

    $scope.login = function() {
      $scope.updating = true;
      AuthService.login({
        email: $scope.model.email,
        password: $scope.model.password
      }, function(response) {
        $scope.updating = false;
        $scope.error = false;
        AuthService.setAuthCookie({
          authToken: response.token
        });
        $scope.model = {};
        console.log('success', response);
      }, function(response) {
        $scope.updating = false;
        $scope.error = response.status;
        console.log('error', response);
      });
    };

    $scope.logout = function() {
      AuthService.removeAuthCookie();
    };
  });

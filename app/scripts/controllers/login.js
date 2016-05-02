'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('LoginCtrl', function ($scope, $state, AuthService) {
    $scope.updating = false;
    $scope.model = {};

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
        AuthService.setCurrentUser(response.user);
        console.log('success', response);
        $state.go('home');
      }, function(response) {
        $scope.updating = false;
        $scope.error = response.status;
        console.log('error', response);
      });
    };
  });

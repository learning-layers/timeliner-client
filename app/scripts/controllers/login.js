'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('LoginCtrl', function ($scope, $state, AuthService, SystemMessagesService) {
    $scope.updating = false;
    $scope.model = {};

    $scope.login = function() {
      $scope.updating = true;
      AuthService.login({
        email: $scope.model.email,
        password: $scope.model.password
      }, function(response) {
        $scope.updating = false;
        AuthService.setAuthCookie({
          authToken: response.token
        });
        $scope.model = {};
        AuthService.setCurrentUser(response.user);
        SystemMessagesService.showSuccess('Welcome back ' + response.user.name.first + ' ' + response.user.name.last + ', you have successfully logged in.');
        $state.go('home');
      }, function(response) {
        $scope.updating = false;

        if ( response.status === 401 ) {
          SystemMessagesService.showError('Authentication failed, please try again!');
        } else {
          SystemMessagesService.showError('Server error, please contact administrator!');
        }
      });
    };
  });

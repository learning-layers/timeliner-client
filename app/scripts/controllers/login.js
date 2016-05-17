'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('LoginCtrl', function ($scope, $state, $mdToast, AuthService) {
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
        $state.go('home');
      }, function(response) {
        $scope.updating = false;
        if ( response.status === 401 ) {
          $mdToast.show(
            $mdToast.simple().textContent('Authentication failed, please try again!').theme('error-toast')
          );
        } else {
          $mdToast.show(
            $mdToast.simple().textContent('Server error, please contact administrator.').theme('error-toast')
          );
        }
      });
    };
  });

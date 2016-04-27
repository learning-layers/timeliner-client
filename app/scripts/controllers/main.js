'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('MainCtrl', function ($scope, AuthService) {

    $scope.createUser = function () {
      $scope.updating = true;

      AuthService.register({email: $scope.registerEmail}, function (success) {
        $scope.updating = false;
        $scope.success = success;
        $scope.registerEmail = '';
      }, function (error) {
        if(error.status === 409){
          $scope.error = 409;
        } else {
          $scope.error = error.status;
        }
        $scope.updating = false;
      });
    };

  });

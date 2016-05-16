'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('RegisterCtrl', function ($scope, AuthService, appConfig, vcRecaptchaService) {
    $scope.captchaKey = appConfig.reCaptchaPublicKey;
    $scope.register = {};

    $scope.createUser = function () {
      $scope.updating = true;

      AuthService.register($scope.register, function (res) {
        $scope.updating = false;
        $scope.error = null;
        $scope.success = res;
        $scope.register.email = '';
      }, function (error) {
        $scope.error = error.status;
        vcRecaptchaService.reload();
        $scope.updating = false;
      });
    };
  });

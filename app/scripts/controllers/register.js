'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('RegisterCtrl', function ($scope, AuthService, appConfig, vcRecaptchaService, SystemMessagesService) {
    $scope.captchaKey = appConfig.reCaptchaPublicKey;
    $scope.register = {};

    $scope.createUser = function () {
      $scope.updating = true;

      AuthService.register($scope.register, function (res) {
        $scope.updating = false;
        SystemMessagesService.showSuccess('VIEWS.LANDING.TOASTS.SUCCESSES.USER_CREATED');
        $scope.error = null;
        $scope.success = res.data;
        $scope.register.email = '';
      }, function (error) {
        $scope.updating = false;
        if ( error.status === 409 ) {
          SystemMessagesService.showError('VIEWS.LANDING.TOASTS.ERRORS.EMAIL_EXISTS');
        } else {
          SystemMessagesService.showError('GENERAL.TOASTS.ERRORS.SERVER_ERROR');
        }
        vcRecaptchaService.reload();
      });
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:PasswordResetCtrl
 * @description
 * # PasswordResetCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('PasswordResetCtrl', function ($scope, $stateParams, $state, AuthService, SystemMessagesService, vcRecaptchaService, appConfig) {
    $scope.captchaKey = appConfig.reCaptchaPublicKey;
    $scope.updating = false;
    $scope.model = {};

    if ( $stateParams.key ) {
      $scope.updating = true;
      AuthService.checkPasswordResetKeyValidity({key: $stateParams.key}, function () {
        $scope.isValidKey = true;
        $scope.updating = false;
      }, function () {
        SystemMessagesService.showError('VIEWS.CONFIRMATION.INVALID_KEY');
        $scope.updating = false;
      });
    }

    $scope.isReset = function() {
      return !!$stateParams.key;
    };

    $scope.submitResetRequest = function() {
      $scope.updating = true;
      AuthService.requestReset($scope.model, function() {
        $scope.updating = false;
        $scope.model = {};
        vcRecaptchaService.reload();
        $scope.success = true;
      }, function(response) {
        SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response));
        $scope.updating = false;
        vcRecaptchaService.reload();
      });
    };

    $scope.submitReset = function () {
      $scope.updating = true;
      AuthService.resetPassword({
        email: $scope.model.email,
        passwordResetKey: $stateParams.key,
        password: $scope.model.password,
      }, function () {
        var resetEmail = $scope.model.email;
        $scope.updating = false;
        $scope.model = {};
        $scope.success = true;
        $state.go('login', { email: resetEmail });
        SystemMessagesService.showSuccess('TOASTS.SUCCESSES.PASSWORD_RESET');
      }, function (response) {
        $scope.updating = false;
        SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response));
      });
    };
  });

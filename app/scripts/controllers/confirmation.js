'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ConfirmationCtrl
 * @description
 * # ConfirmationCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ConfirmationCtrl', function ($scope, $state, $stateParams, AuthService, UsersService, SystemMessagesService) {

    $scope.form = {};

    AuthService.checkConfirmationKeyValidity({key: $stateParams.key}, function (res) {
      $scope.userEmail = res.data.email;
    }, function () {
      SystemMessagesService.showError('VIEWS.CONFIRMATION.INVALID_KEY');
    });

    $scope.confirmUser = function () {
      $scope.updating = true;

      $scope.form.confirmationKey = $stateParams.key;
      AuthService.confirm($scope.form, function (response) {
        $scope.updating = false;
        $scope.form = {};
        $scope.confirmationSuccessful = true;
        AuthService.setCookieAndUser(response.data.token, response.data.user);
        SystemMessagesService.showSuccess('VIEWS.CONFIRMATION.REGISTRATION_COMPLETED');
        SystemMessagesService.showSuccess('TOASTS.SUCCESSES.LOGIN_SUCCESS', { FULL_NAME: UsersService.getFullName(response.data.user) });
        $state.go('home');
      }, function () {
        $scope.updating = false;
        SystemMessagesService.showError('TOASTS.ERRORS.INTERNAL_SERVER_ERROR');
      });
    };
  });

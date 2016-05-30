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

    AuthService.checkConfirmationKeyValidity({key: $stateParams.key}, function (success) {
      $scope.userEmail = success.email;
    }, function () {
      $scope.invalidKey = true;
    });

    $scope.confirmUser = function () {
      $scope.updating = true;

      $scope.form.confirmationKey = $stateParams.key;
      AuthService.confirm($scope.form, function (response) {
        $scope.updating = false;
        $scope.form = {};
        $scope.confirmationSuccessful = true;
        AuthService.setCookieAndUser(response.data.token, response.data.user);
        SystemMessagesService.showSuccess('Welcome back ' + UsersService.getFullName(response.data.user) + ', you have successfully logged in.');
        $state.go('home');
      }, function () {
        $scope.updating = false;
      });
    };
  });

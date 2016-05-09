'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ConfirmationCtrl
 * @description
 * # ConfirmationCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ConfirmationCtrl', function ($scope, $stateParams, AuthService) {

    $scope.form = {};

    AuthService.checkConfirmationKeyValidity({key: $stateParams.key}, function (success) {
      $scope.userEmail = success.email;
    }, function () {
      $scope.invalidKey = true;
    });

    $scope.confirmUser = function () {
      $scope.updating = true;

      $scope.form.confirmationKey = $stateParams.key;
      AuthService.confirm($scope.form, function () {
        $scope.updating = false;
        $scope.form = {};
        $scope.confirmationSuccessful = true;
      }, function () {
        $scope.updating = false;
      });
    };
  });
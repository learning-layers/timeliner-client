'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('RegisterCtrl', function ($scope, $stateParams, AuthService) {

    $scope.form = {};

    AuthService.checkConfirmationKeyValidity({key: $stateParams.key}, function (success) {
      $scope.userEmail = success.email;
    }, function (error) {
      console.log('checkConfirmationKeyValidity Error', error); // TODO Either use or remove
      $scope.invalidKey = true;
    });

    $scope.confirmUser = function () {
      $scope.updating = true;

      $scope.form.confirmationKey = $stateParams.key;
      AuthService.confirm($scope.form, function (successCB) {
        console.log('confirmUser successCB', successCB); // TODO Either use or remove
        $scope.updating = false;
        $scope.form = {};
        $scope.confirmationSuccessful = true;
      }, function (error) {
        console.log('confirmUser Error', error); // TODO Either use or remove
        $scope.updating = false;
      });
    };
  });

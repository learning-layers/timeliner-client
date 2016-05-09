'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateNewProjectModalInstanceCtrl
 * @description
 * # CreateNewProjectModalInstanceCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateNewProjectModalInstanceCtrl', function ($scope, $uibModalInstance) {

    $scope.updating = false;

    $scope.format = 'dd-MM-yyyy';

    $scope.model = {};

    $scope.popupStart = {
      opened: false
    };

    $scope.popupEnd = {
      opened: false
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.submit = function() {
      $scope.updating = true;
      // TODO Create a new project
      $uibModalInstance.close($scope.model);
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.openStart = function() {
      $scope.popupStart.opened = true;
    };

    $scope.openEnd = function() {
      $scope.popupEnd.opened = true;
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateNewProjectModalInstanceCtrl
 * @description
 * # CreateNewProjectModalInstanceCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateNewProjectModalInstanceCtrl', function ($scope, $uibModalInstance, $log, ProjectsService) {

    $scope.updating = false;

    $scope.format = 'dd-MM-yyyy';

    $scope.model = {
      start: new Date()
    };

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
      ProjectsService.create({}, {
        title: $scope.model.title,
        start: $scope.model.start,
        end: $scope.model.end
      }, function(response) {
        $log.log('Project creation success', response);
        $scope.updating = false;
        $uibModalInstance.close($scope.model);
      }, function(err) {
        $log.error('Project creation error', err);
        $scope.updating = false;
      });
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

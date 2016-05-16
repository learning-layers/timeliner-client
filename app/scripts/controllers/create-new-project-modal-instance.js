'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateNewProjectModalInstanceCtrl
 * @description
 * # CreateNewProjectModalInstanceCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateNewProjectModalInstanceCtrl', function ($scope, $mdDialog, $log, ProjectsService) {

    $scope.updating = false;

    $scope.model = {
      start: new Date(),
      end: null
    };

    $scope.submit = function() {
      $scope.updating = true;
      ProjectsService.create({}, {
        title: $scope.model.title,
        start: $scope.model.start,
        end: $scope.model.end
      }, function(response) {
        $log.debug('Project creation success', response);
        $scope.updating = false;
        $mdDialog.hide(response.data);
      }, function(err) {
        $log.error('Project creation error', err);
        $scope.updating = false;
      });
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });

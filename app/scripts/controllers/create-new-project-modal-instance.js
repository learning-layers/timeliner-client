'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateNewProjectModalInstanceCtrl
 * @description
 * # CreateNewProjectModalInstanceCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateNewProjectModalInstanceCtrl', function ($scope, $mdDialog, $log, ProjectsService, project) {

    $scope.updating = false;

    if(project){
      $scope.model = {
        title: project.title,
        description: project.description,
        goal: project.goal,
        status: project.status,
        start: new Date(project.start),
        end: project.end ? new Date(project.end) : null
      };
    } else {
      $scope.model = {
        start: new Date(),
        end: null
      };
    }

    $scope.test = 0;

    $scope.submit = function() {
      $scope.updating = true;
      ProjectsService.create({}, {
        title: $scope.model.title,
        description: $scope.model.description,
        goal: $scope.model.goal,
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

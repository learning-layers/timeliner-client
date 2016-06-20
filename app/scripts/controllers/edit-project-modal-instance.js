'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:EditProjectModalInstanceCtrl
 * @description
 * # EditProjectModalInstanceCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('EditProjectModalInstanceCtrl', function ($scope, $log, $mdDialog, ProjectsService, AuthService, project) {
    $scope.updating = false;

    $scope.projectStates = [
      {
        value: 'active',
        label: 'VIEWS.PROJECT_LIST.EDIT_PROJECT.STATE_ACTIVE'
      },
      {
        value: 'finished',
        label: 'VIEWS.PROJECT_LIST.EDIT_PROJECT.STATE_FINISHED'
      }
    ];

    $scope.model = {
      title: project.title,
      description: project.description,
      goal: project.goal,
      status: project.status,
      start: new Date(project.start),
      end: project.end ? new Date(project.end) : null,
    };

    $scope.isOwner = function() {
      var currentUser = AuthService.getCurrentUser();

      return project.owner._id === currentUser._id;
    };

    $scope.submit = function() {
      $scope.updating = true;
      ProjectsService.update({
        id: project._id
      }, {
        title: $scope.model.title,
        description: $scope.model.description,
        goal: $scope.model.goal,
        status: $scope.isOwner() ? $scope.model.status : null,
        end: $scope.model.end
      }, function(response) {
        $log.debug('Project edit success', response);
        $scope.updating = false;
        $mdDialog.hide(response.data);
      }, function(err) {
        $log.error('Project edit error', err);
        $scope.updating = false;
      });
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });

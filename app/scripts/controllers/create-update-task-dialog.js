'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateUpdateTaskDialogCtrl
 * @description
 * # CreateUpdateTaskDialogCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateUpdateTaskDialogCtrl', function ($scope, $mdDialog, $log, project, task, ProjectsService, SystemMessagesService) {
    $scope.updating = false;

    $scope.model = {
      _id: ( task && task._id ) ? task._id : null,
      title: ( task && task.title ) ? task.title: '',
      description: ( task && task.description ) ? task.description : '',
      start: ( task && task.start ) ? new Date(task.start) : null,
      end: ( task && task.end ) ? new Date(task.end) : null,
    };

    $scope.isEdit = function() {
      return !!$scope.model._id;
    };

    $scope.submit = function() {
      $scope.updating = true;
      if ( $scope.isEdit() ) {
        ProjectsService.updateTask({
          project: project._id,
          id: $scope.model._id
        }, {
          title: $scope.model.title,
          description: $scope.model.description,
          start: $scope.model.start,
          end: $scope.model.end,
        }, function(response) {
          $log.debug('Task update success', response);
          $scope.updating = false;
          $mdDialog.hide(response.data);
          SystemMessagesService.showSuccess('TOASTS.SUCCESSES.TASK_UPDATED');
        }, function(err) {
          $log.error('Task update error', err);
          $scope.updating = false;
        });
      } else {
        ProjectsService.createTask({
          project: project._id
        }, {
          title: $scope.model.title,
          description: $scope.model.description,
          start: $scope.model.start,
          end: $scope.model.end
        }, function(response) {
          $log.debug('Task creation success', response);
          $scope.updating = false;
          $mdDialog.hide(response.data);
          SystemMessagesService.showSuccess('TOASTS.SUCCESSES.TASK_CREATED');
        }, function(err) {
          $log.error('Task creation error', err);
          $scope.updating = false;
        });
      }
    };

    $scope.delete = function() {
      ProjectsService.deleteTask({
        project: project._id,
        id: $scope.model._id
      }, function(response) {
        $log.debug('Task delete success', response);
        $scope.updating = false;
        $mdDialog.hide(response.data);
        SystemMessagesService.showSuccess('TOASTS.SUCCESSES.TASK_REMOVED');
      }, function(err) {
        $log.error('Task removal error', err);
        $scope.updating = false;
      });
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });

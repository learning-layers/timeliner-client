'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateUpdateTaskDialogCtrl
 * @description
 * # CreateUpdateTaskDialogCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateUpdateTaskDialogCtrl', function ($scope, $mdDialog, project, task, ProjectsService, SystemMessagesService, UsersService) {
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

    $scope.isStartDateRequired = function() {
      return !!$scope.model.end;
    };

    $scope.isEndDateRequired = function() {
      return !!$scope.model.start;
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
          $scope.updating = false;
          $mdDialog.hide(response.data);
        }, function(response) {
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="taskForm"]'));
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
          $scope.updating = false;
          $mdDialog.hide(response.data);
        }, function(response) {
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="taskForm"]'));
          $scope.updating = false;
        });
      }
    };

    $scope.delete = function() {
      ProjectsService.deleteTask({
        project: project._id,
        id: $scope.model._id
      }, function(response) {
        $scope.updating = false;
        $mdDialog.hide(response.data);
      }, function(response) {
        SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="taskForm"]'));
        $scope.updating = false;
      });
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.getUserFullName = function(user) {
      return UsersService.getFullName(user);
    };

    $scope.getUserImage = function(user) {
      return UsersService.getImage(user);
    };

    $scope.getResourceIcon = function(resource) {
      return ProjectsService.getResourceIcon(resource);
    };

    function removeFromTask(object, objectType) {
      var objectTypePlural = objectType + 's';

      return ProjectsService.removeObjectFromTask({
        project: project._id,
        task: task._id,
        objectType: objectTypePlural,
        objectId: object._id
      }, {}, function() {
      }, function(err) {
        SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(err), null, document.querySelector('form[name="taskForm"]'));
      });
    }

    $scope.removeOutcome = function(ev, index, outcome) {
      removeFromTask(outcome, 'outcome').$promise.then(function() {
        $scope.outcomes.splice(index, 1);
      });
    };

    $scope.removeParticipant = function(ev, index, participant) {
      removeFromTask(participant, 'participant').$promise.then(function() {
        $scope.participants.splice(index, 1);
      });
    };

    $scope.removeResource = function(ev, index, resource) {
      removeFromTask(resource, 'resource').$promise.then(function() {
        $scope.resources.splice(index, 1);
      });
    };

    if ( $scope.isEdit() ) {
      $scope.outcomes = task.outcomes;
      $scope.participants = task.participants;
      $scope.resources = task.resources;
    }
  });

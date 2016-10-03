'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateUpdateProjectDialogCtrl
 * @description
 * # CreateUpdateProjectDialogCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateUpdateProjectDialogCtrl', function ($scope, $mdDialog, $log, ProjectsService, project, SystemMessagesService) {

    $scope.updating = false;

    $scope.model = {
      _id: ( project && project._id ) ? project._id : null,
      title: ( project && project.title ) ? project.title : '',
      description: ( project && project.description ) ? project.description : '',
      goal: ( project && project.goal ) ? project.goal : '',
      status: ( project && project.status ) ? project.status : null,
      start: ( project && project.start ) ? new Date(project.start) : new Date(),
      end: ( project && project.end ) ? new Date(project.end) : null
    };

    $scope.test = 0;

    $scope.isEdit = function() {
      return !!$scope.model._id;
    };

    $scope.submit = function() {
      $scope.updating = true;
      if ( $scope.isEdit() ) {
        ProjectsService.update({
          id: $scope.model._id
        }, {
          title: $scope.model.title,
          description: $scope.model.description,
          goal: $scope.model.goal,
          start: $scope.model.start,
          end: $scope.model.end
        }, function(response) {
          $log.debug('Project update success', response);
          $scope.updating = false;
          $mdDialog.hide(response.data);
        }, function(err) {
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(err), null, document.querySelector('form[name="projectForm"]'));
          $scope.updating = false;
        });
      } else {
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
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(err), null, document.querySelector('form[name="projectForm"]'));
          $scope.updating = false;
        });
      }
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });

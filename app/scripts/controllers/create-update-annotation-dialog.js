'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateUpdateAnnotationDialogCtrl
 * @description
 * # CreateUpdateAnnotationDialogCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateUpdateAnnotationDialogCtrl', function ($scope, $mdDialog, $log, project, annotation, ProjectsService, SystemMessagesService) {
    $scope.updating = false;

    $scope.model = {
      _id: ( annotation && annotation._id ) ? annotation._id : null,
      title: ( annotation && annotation.title ) ? annotation.title: '',
      description: ( annotation && annotation.description ) ? annotation.description : '',
      start: ( annotation && annotation.start ) ? new Date(annotation.start) : new Date()
    };

    $scope.isEdit = function() {
      return !!$scope.model._id;
    };

    $scope.submit = function() {
      $scope.updating = true;
      if ( $scope.isEdit() ) {
        ProjectsService.updateAnnotation({
          project: project._id,
          id: $scope.model.id
        }, {
          title: $scope.model.title,
          description: $scope.model.description,
          start: $scope.model.start
        }, function(response) {
          $log.debug('Annotation update success', response);
          $scope.updating = false;
          $mdDialog.hide(response.data);
          SystemMessagesService.showSuccess('TOASTS.SUCCESSES.ANNOTATION_UPDATED');
        }, function(err) {
          $log.error('Annotation update error', err);
          $scope.updating = false;
        });
      } else {
        ProjectsService.createAnnotation({
          project: project._id
        }, {
          title: $scope.model.title,
          description: $scope.model.description,
          start: $scope.model.start
        }, function(response) {
          $log.debug('Annotation creation success', response);
          $scope.updating = false;
          $mdDialog.hide(response.data);
          SystemMessagesService.showSuccess('TOASTS.SUCCESSES.ANNOTATION_CREATED');
        }, function(err) {
          $log.error('Annotation creation error', err);
          $scope.updating = false;
        });
      }
    };

    $scope.delete = function() {
      ProjectsService.deleteAnnotation({
        project: project._id,
        id: $scope.model.id
      }, function(response) {
        $log.debug('Annotation delete success', response);
        $scope.updating = false;
        $mdDialog.hide(response.data);
        SystemMessagesService.showSuccess('TOASTS.SUCCESSES.ANNOTATION_REMOVED');
      }, function(err) {
        $log.error('Annotation removal error', err);
        $scope.updating = false;
      });
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateUpdateAnnotationDialogCtrl
 * @description
 * # CreateUpdateAnnotationDialogCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateUpdateAnnotationDialogCtrl', function ($scope, $mdDialog, project, annotation, ProjectsService, SystemMessagesService) {
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
          id: $scope.model._id
        }, {
          title: $scope.model.title,
          description: $scope.model.description,
          start: $scope.model.start
        }, function(response) {
          $scope.updating = false;
          $mdDialog.hide(response.data);
        }, function(response) {
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="annotationForm"]'));
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
          $scope.updating = false;
          $mdDialog.hide(response.data);
        }, function(response) {
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="annotationForm"]'));
          $scope.updating = false;
        });
      }
    };

    $scope.delete = function() {
      ProjectsService.deleteAnnotation({
        project: project._id,
        id: $scope.model._id
      }, function(response) {
        $scope.updating = false;
        $mdDialog.hide(response.data);
      }, function(response) {
        SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="annotationForm"]'));
        $scope.updating = false;
      });
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });

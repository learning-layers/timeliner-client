'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateUpdateResourceDialogCtrl
 * @description
 * # CreateUpdateResourceDialogCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateUpdateResourceDialogCtrl', function ($scope, $mdDialog, project, resource, ProjectsService, SystemMessagesService, appConfig) {
    function getFormData() {
      var formData = new FormData();
      formData.append('title', $scope.model.title);
      formData.append('description', $scope.model.description);

      if ( $scope.model.url ) {
        formData.append('url', $scope.model.url);
      }
      if ( $scope.model.file ) {
        formData.append('file', $scope.model.file);
      }

      return formData;
    }

    $scope.updating = false;

    $scope.model = {
      _id: ( resource && resource._id ) ? resource._id : null,
      title: ( resource && resource.title ) ? resource.title: '',
      description: ( resource && resource.description ) ? resource.description : '',
      url: ( resource && resource.url ) ? resource.url : '',
      file: ( resource && resource.file ) ? resource.file : null
    };

    $scope.isEdit = function() {
      return !!$scope.model._id;
    };

    $scope.isFileSelected = function() {
      return !!$scope.model.file;
    };

    $scope.isUrlSelected = function() {
      return !!$scope.model.url;
    };

    $scope.canSubmit = function() {
      if ( !( $scope.model.file || $scope.model.url ) ) {
        return false;
      }

      return true;
    };

    $scope.submit = function() {
      $scope.updating = true;
      if ( $scope.isEdit() ) {
        ProjectsService.updateResource({
          project: project._id,
          id: $scope.model._id
        }, getFormData(), function(response) {
          $scope.updating = false;
          $mdDialog.hide(response.data);
          SystemMessagesService.showSuccess('TOASTS.SUCCESSES.RESOURCE_UPDATED');
        }, function(response) {
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="resourceForm"]'));
          $scope.updating = false;
        });
      } else {
        ProjectsService.createResource({
          project: project._id
        }, getFormData(), function(response) {
          $scope.updating = false;
          $mdDialog.hide(response.data);
          SystemMessagesService.showSuccess('TOASTS.SUCCESSES.RESOURCE_CREATED');
        }, function(response) {
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="resourceForm"]'));
          $scope.updating = false;
        });
      }
    };

    $scope.delete = function() {
      ProjectsService.deleteResource({
        project: project._id,
        id: $scope.model._id
      }, function(response) {
        $scope.updating = false;
        $mdDialog.hide(response.data);
        SystemMessagesService.showSuccess('TOASTS.SUCCESSES.RESOURCE_REMOVED');
      }, function(response) {
        SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="resourceForm"]'));
        $scope.updating = false;
      });
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.getUploadFileSize = function() {
      return ProjectsService.bytesToHumanReadable(appConfig.uploadFileSizeLimit, 0);
    };
  });

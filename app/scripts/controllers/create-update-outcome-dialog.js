'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateUpdateOutcomeDialogCtrl
 * @description
 * # CreateUpdateOutcomeDialogCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateUpdateOutcomeDialogCtrl', function ($scope, $mdDialog, $window, project, outcome, ProjectsService, SystemMessagesService, UsersService) {
    function getFormData() {
      var formData = new FormData();
      formData.append('title', $scope.model.title);
      formData.append('description', $scope.model.description);

      if ( $scope.model.file ) {
        formData.append('file', $scope.model.file);
      }

      return formData;
    }

    $scope.updating = false;

    $scope.model = {
      _id: ( outcome && outcome._id ) ? outcome._id : null,
      title: ( outcome && outcome.title ) ? outcome.title: '',
      description: ( outcome && outcome.description ) ? outcome.description : '',
      url: ( outcome && outcome.url ) ? outcome.url : '',
      file: ( outcome && outcome.file ) ? outcome.file : null
    };

    if ( outcome && outcome._id ) {
      $scope.versions = outcome.versions;
    }

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
      if ( !$scope.isEdit() ) {
        if ( !$scope.model.file ) {
          return false;
        }
      }

      return true;
    };

    $scope.submit = function() {
      $scope.updating = true;
      if ( $scope.isEdit() ) {
        ProjectsService.updateOutcome({
          project: project._id,
          id: $scope.model._id
        }, getFormData(), function(response) {
          $scope.updating = false;
          $mdDialog.hide(response.data);
          SystemMessagesService.showSuccess('TOASTS.SUCCESSES.OUTCOME_UPDATED');
        }, function(response) {
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="outcomeForm"]'));
          $scope.updating = false;
        });
      } else {
        ProjectsService.createOutcome({
          project: project._id
        }, getFormData(), function(response) {
          $scope.updating = false;
          $mdDialog.hide(response.data);
          SystemMessagesService.showSuccess('TOASTS.SUCCESSES.OUTCOME_CREATED');
        }, function(response) {
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="outcomeForm"]'));
          $scope.updating = false;
        });
      }
    };

    $scope.delete = function() {
      ProjectsService.deleteOutcome({
        project: project._id,
        id: $scope.model._id
      }, function(response) {
        $scope.updating = false;
        $mdDialog.hide(response.data);
        SystemMessagesService.showSuccess('TOASTS.SUCCESSES.OUTCOME_REMOVED');
      }, function(response) {
        SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="outcomeForm"]'));
        $scope.updating = false;
      });
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.getIcon = function(resource) {
      return ProjectsService.getIcon(resource);
    };

    $scope.bytesToHumanReadable = function(size) {
      var kb = 1024,
          mb = kb * 1024,
          gb = mb * 1024;

      if ( size > gb ) {
        return (size / gb).toFixed(2) + ' GB';
      } else if ( size > mb ) {
        return (size / mb).toFixed(2) + ' MB';
      } else {
        return ( size / kb).toFixed(2) + ' KB';
      }
    };

    $scope.getVersionDownloadLink = function(version) {
      return ProjectsService.generateOutcomeDownloadUrl(outcome._id, version._id);
    };

    $scope.downloadVersion = function(ev, version) {
      if ( version.file ) {
        $window.open( $scope.getVersionDownloadLink(version), '_blank');
      }
    };

    $scope.getUserFullName = function(user) {
      return UsersService.getFullName(user);
    };

    $scope.getUserImage = function(user) {
      return UsersService.getImage(user);
    };
  });

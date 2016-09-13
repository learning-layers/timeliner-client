'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateUpdateMilestoneDialogCtrl
 * @description
 * # CreateUpdateMilestoneDialogCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateUpdateMilestoneDialogCtrl', function ($scope, $mdDialog, project, milestone, ProjectsService, SystemMessagesService) {
    $scope.updating = false;

    $scope.model = {
      _id: ( milestone && milestone._id ) ? milestone._id : null,
      title: ( milestone && milestone.title ) ? milestone.title: '',
      description: ( milestone && milestone.description ) ? milestone.description : '',
      start: ( milestone && milestone.start ) ? new Date(milestone.start) : new Date(),
      color: ( milestone && milestone.color ) ? milestone.color : 1
    };

    $scope.isEdit = function() {
      return !!$scope.model._id;
    };

    $scope.submit = function() {
      $scope.updating = true;
      if ( $scope.isEdit() ) {
        ProjectsService.updateMilestone({
          project: project._id,
          id: $scope.model._id
        }, {
          title: $scope.model.title,
          description: $scope.model.description,
          start: $scope.model.start,
          color: $scope.model.color
        }, function(response) {
          $scope.updating = false;
          $mdDialog.hide(response.data);
          SystemMessagesService.showSuccess('TOASTS.SUCCESSES.MILESTONE_UPDATED');
        }, function(response) {
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="milestoneForm"]'));
          $scope.updating = false;
        });
      } else {
        ProjectsService.createMilestone({
          project: project._id
        }, {
          title: $scope.model.title,
          description: $scope.model.description,
          start: $scope.model.start,
          color: $scope.model.color
        }, function(response) {
          $scope.updating = false;
          $mdDialog.hide(response.data);
          SystemMessagesService.showSuccess('TOASTS.SUCCESSES.MILESTONE_CREATED');
        }, function(response) {
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="milestoneForm"]'));
          $scope.updating = false;
        });
      }
    };

    $scope.delete = function() {
      ProjectsService.deleteMilestone({
        project: project._id,
        id: $scope.model._id
      }, function(response) {
        $scope.updating = false;
        $mdDialog.hide(response.data);
        SystemMessagesService.showSuccess('TOASTS.SUCCESSES.MILESTONE_REMOVED');
      }, function(response) {
        SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response), null, document.querySelector('form[name="milestoneForm"]'));
        $scope.updating = false;
      });
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });

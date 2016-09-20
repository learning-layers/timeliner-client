'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ActivityStreamPanelCtrl
 * @description
 * # ActivityStreamPanelCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ActivityStreamPanelCtrl', function ($scope, ProjectsService, SystemMessagesService) {
    $scope.updating = false;
    $scope.model = {
      message: ''
    };

    function resetMessageForm() {
      $scope.model.message = '';
      document.getElementsByName('messageForm')[0].reset();
    }

    $scope.canSubmitMessage = function() {
      // Not updating and has message
      return !( $scope.updating || !$scope.model.message.trim() );
    };

    $scope.submitMessage = function() {
      $scope.updaring = true;
      ProjectsService.createMessage({
        project: $scope.project._id
      }, {
        message: $scope.model.message
      }, function() {
        resetMessageForm();
        $scope.updating = false;
      }, function(response) {
        SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response));
        $scope.updating = false;
      });
    };
  });

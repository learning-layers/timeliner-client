'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ActivityStreamPanelCtrl
 * @description
 * # ActivityStreamPanelCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ActivityStreamPanelCtrl', function ($scope, ProjectsService, SystemMessagesService, UsersService, $filter) {
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

    $scope.getActivityTranslateTemplate = function(activity) {
      var template = 'STREAM.' + activity.objectType + '.' + activity.activityType;

      return template.toUpperCase();
    };

    $scope.getActivityTranslateValues = function(activity) {
      var values = {};

      values.FULL_NAME = UsersService.getFullName(activity.actor);

      if ( activity.data.title ) {
        values.TITLE = activity.data.title;
      }
      if ( activity.data.start ) {
        values.START = $filter('tlDate')(activity.data.start, false);
      }
      if ( activity.data.end ) {
        values.END = $filter('tlDate')(activity.data.end, false);
      }

      return values;
    };

    $scope.getMessageTranslateValues = function(message) {
      return {
        DATE: $filter('tlDate')(message.created, true),
        FULL_NAME: UsersService.getFullName(message.creator)
      };
    };
  });

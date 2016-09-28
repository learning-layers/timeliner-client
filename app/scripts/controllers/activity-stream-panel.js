'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ActivityStreamPanelCtrl
 * @description
 * # ActivityStreamPanelCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ActivityStreamPanelCtrl', function ($scope, ProjectsService, SystemMessagesService, UsersService, $filter, _, $log, $, appConfig) {
    $scope.updating = false;
    $scope.loadingMessages = false;
    $scope.moreMessagesLeft = true;
    $scope.loadingActivities = false;
    $scope.moreActivitiesLeft = true;
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

    function loadMoreMessages() {
      if ( $scope.messages.length === 0 ) {
        return;
      }

      $scope.loadingMessages = true;
      var lastMessage = $scope.messages[$scope.messages.length-1];
      ProjectsService.getProjectMessages({
        project: lastMessage.project,
        lastCreated: lastMessage.created,
        limit: appConfig.paginationSize
      }, function(result) {
        if ( result.data.length < appConfig.paginationSize ) {
          $scope.moreMessagesLeft = false;
        }

        if ( result.data.length > 0 ) {
          // XXX This is highly ineffective
          _(result.data).each(function(message) {
            $scope.messages.push(message);
          });
        } else {
          $scope.moreMessagesLeft = false;
        }

        $scope.loadingMessages = false;
      }, function(err) {
        $scope.loadingMessages = false;
        $log.error('ERROR getting project messages', err);
      });
    }

    function loadMoreActivities() {
      if ( $scope.activities.length === 0 ) {
        return;
      }

      $scope.loadingActivities = true;
      var lastActivity = $scope.activities[$scope.activities.length-1];
      ProjectsService.getProjectActivities({
        project: lastActivity.project,
        lastCreated: lastActivity.created,
        limit: appConfig.paginationSize
      }, function(result) {
        if ( result.data.length < appConfig.paginationSize ) {
          $scope.moreActivitiesLeft = false;
        }

        if ( result.data.length > 0 ) {
          // XXX This is highly ineffective
          _(result.data).each(function(activity) {
            $scope.activities.push(activity);
          });
        } else {
          $scope.moreActivitiesLeft = false;
        }

        $scope.loadingActivities = false;
      }, function(err) {
        $scope.loadingActivities = false;
        $log.error('ERROR getting project activities', err);
      });
    }

    function isScrolledToBottom(ev) {
      var elem = $(ev.currentTarget);
      if ( elem[0].scrollHeight - elem.scrollTop() === elem.outerHeight() )  {
        return true;
      }

      return false;
    }

    function loadMoreMessagesOnBottom(ev) {
      if ( isScrolledToBottom(ev) )  {
        ev.preventDefault();
        ev.stopPropagation();
        if ( !$scope.loadingMessages && $scope.moreMessagesLeft ) {
          loadMoreMessages();
        }
      }
    }

    function loadMoreActivitiesOnBottom(ev) {
      if ( isScrolledToBottom(ev) )  {
        ev.preventDefault();
        ev.stopPropagation();
        if ( !$scope.loadingActivities && $scope.moreActivitiesLeft ) {
          loadMoreActivities();
        }
      }
    }

    // This is not the most elegant solution
    // There might be a way to listen to tabs being rendered and then setup the listeners
    setTimeout(function() {
      $('#tl-project-messages').on('scroll', loadMoreMessagesOnBottom);
      $('#tl-project-activities').on('scroll', loadMoreActivitiesOnBottom);
    }, 1000);
  });

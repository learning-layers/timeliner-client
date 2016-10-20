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
    $scope.loadingActivities = false;
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
      if ( activity.data.user && activity.data.user.name ) {
        values.PARTICIPANT_FULL_NAME = UsersService.getFullName(activity.data.user);
      }

      return values;
    };

    $scope.getMessageTranslateValues = function(message) {
      return {
        DATE: $filter('tlDate')(message.created, true),
        FULL_NAME: UsersService.getFullName(message.creator)
      };
    };

    $scope.canShowOnTimeline = function(activity) {
      var timelineTypes = ['annotation', 'milestone', 'task', 'outcome'];
      if ( activity.activityType === 'delete' ) {
        return false;
      }

      if ( timelineTypes.indexOf(activity.objectType) === -1 ) {
        return false;
      }

       // TODO It might make sense to either check if item really exists and is on timeline
       // or add some functiona that would be determining that and hiding the button

      return true;
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
        if ( result.data.remaining === 0 ) {
          $scope.moreMessagesLeft = false;
        }

        if ( result.data.messages.length > 0 ) {
          Array.prototype.push.apply($scope.messages, result.data.messages);
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
        if ( result.data.remaining === 0 ) {
          $scope.moreActivitiesLeft = false;
        }

        if ( result.data.activities.length > 0 ) {
          Array.prototype.push.apply($scope.activities, result.data.activities);
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

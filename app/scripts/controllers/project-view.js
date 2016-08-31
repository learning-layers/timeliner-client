'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ProjectviewCtrl
 * @description
 * # ProjectviewCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ProjectViewCtrl', function ($scope, $stateParams, $log, $mdDialog, $mdMedia, appConfig, ProjectsService, SocketService, _, SystemMessagesService) {
    $scope.fabOpen = false; // TODO this doesn't seem to have an effect, #6788 in md github
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.projectTimelineData = {
      milestones: [],
      annotations: []
    };

    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
    $scope.$watch(function() { // TODO decide if this $mdMedia watcher is necessary
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });

    function findAnnotationIndex(annotation) {
      return _($scope.projectTimelineData.annotations).findIndex(function(o) {
        return o._id === annotation._id;
      });
    }

    function findAnnotationById(id) {
      return _($scope.projectTimelineData.annotations).find(function(o) {
        return o._id === id;
      });
    }

    function findMilestoneIndex(milestone) {
      return _($scope.projectTimelineData.milestones).findIndex(function(o) {
        return o._id === milestone._id;
      });
    }

    function findMilestoneById(id) {
      return _($scope.projectTimelineData.milestones).find(function(o){
        return o._id === id;
      });
    }

    var socketJoinCallback = function(data) {
      if ( !data.user && data.success !== true ) {
        SystemMessagesService.showError('TOASTS.ERRORS.SOCKET_JOIN_ERROR');
        $log.debug('Socket JOIN failed', data);
      }
    };

    var socketCreateAnnotationCallback = function(annotation) {
      $log.debug('Socket create:annotation', annotation);
      $scope.projectTimelineData.annotations.push(annotation);
      $scope.$broadcast('tl:timeline:add:annotation', annotation);
    };

    var socketUpdateAnnotationCallback = function(annotation) {
      $log.debug('Socket update:annotation', annotation);
      var index = findAnnotationIndex(annotation);
      $scope.projectTimelineData.annotations[index] = annotation;
      $scope.$broadcast('tl:timeline:update:annotation', annotation);
    };

    var socketDeleteAnnotationCallback = function(annotation) {
      $log.debug('Socket delete:annotation', annotation);
      var index = findAnnotationIndex(annotation);
      $scope.projectTimelineData.annotations.splice(index, 1);
      $scope.$broadcast('tl:timeline:delete:annotation', annotation);
    };

    var socketMoveAnnotationCallback = function(annotation) {
      $log.debug('Socket move:annotation', annotation);
      var index = findAnnotationIndex(annotation);
      $scope.projectTimelineData.annotations[index].start = annotation.start;
      $scope.$broadcast('tl:timeline:move:annotation', annotation);
    };

    var socketCreateMilestoneCallback = function(milestone) {
      $log.debug('Socket create:milestone', milestone);
      $scope.projectTimelineData.milestones.push(milestone);
      $scope.$broadcast('tl:timeline:add:milestone', milestone);
    };

    var socketUpdateMilestoneCallback = function(milestone) {
      $log.debug('Socket update:milestone', milestone);
      var index = findMilestoneIndex(milestone);
      $scope.projectTimelineData.milestones[index] = milestone;
      $scope.$broadcast('tl:timeline:update:milestone', milestone);
    };

    var socketDeleteMilestoneCallback = function(milestone) {
      $log.debug('Socket delete:milestone', milestone);
      var index = findMilestoneIndex(milestone);
      $scope.projectTimelineData.milestones.splice(index, 1);
      $scope.$broadcast('tl:timeline:delete:milestone', milestone);
    };

    var socketMoveMilestoneCallback = function(milestone) {
      $log.debug('Socket move:milestone', milestone);
      var index = findMilestoneIndex(milestone);
      $scope.projectTimelineData.milestones[index].start = milestone.start;
      $scope.$broadcast('tl:timeline:move:milestone', milestone);
    };

    if ( $scope.isLoggedIn() ) {
      ProjectsService.get({id: $stateParams.id}, function(result) {
        $scope.project = result.data;

        SocketService.emit('join', {
          id: $scope.project._id
        });
        SocketService.on('join', socketJoinCallback);
        SocketService.on('create:annotation', socketCreateAnnotationCallback);
        SocketService.on('update:annotation', socketUpdateAnnotationCallback);
        SocketService.on('delete:annotation', socketDeleteAnnotationCallback);
        SocketService.on('move:annotation', socketMoveAnnotationCallback);
        SocketService.on('create:milestone', socketCreateMilestoneCallback);
        SocketService.on('update:milestone', socketUpdateMilestoneCallback);
        SocketService.on('delete:milestone', socketDeleteMilestoneCallback);
        SocketService.on('move:milestone', socketMoveMilestoneCallback);
      }, function(err) {
        // TODO It would make sense to display a meaningful system message if that ever happened
        $log.debug('ERROR getting project', err);
      });
      // XXX Might make sense to wait untill all the data needed to build out the timeline is fetched and only then set
      // the data as needed, this way there would be less full rebuild iterations for the timeline
      // Show some spinner in the meantime
      // XXX Need to decide when should the Socket kick-in and how to store updates that come before data is loaded
      ProjectsService.getProjectMilestones({
        project: $stateParams.id
      }, function(result) {
        $scope.projectTimelineData.milestones = result.data;
        $log.debug(result);
      }, function(err) {
        $log.debug('ERROR getting project milestones', err);
      });
      ProjectsService.getProjectAnnotations({
        project: $stateParams.id
      }, function(result) {
        $scope.projectTimelineData.annotations = result.data;
        $log.debug(result);
      }, function(err) {
        $log.debug('ERROR getting project annotations', err);
      });
    }

    $scope.addOrUpdateAnnotation = function(ev, annotation) {
      $mdDialog.show({
          controller: 'CreateUpdateAnnotationDialogCtrl',
          templateUrl: 'views/templates/create-update-annotation-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen,
          locals: {
            project: $scope.project,
            annotation: annotation
          }
        })
        .then(function(annotation) {
          // TODO Show annotation created toast
          $log.debug('Dialog returned annotation:', annotation);
        }, function() {
          // Dialog dismissed, do nothing for now
        });
    };

    $scope.addOrUpdateMilestone = function(ev, milestone) {
      $mdDialog.show({
          controller: 'CreateUpdateMilestoneDialogCtrl',
          templateUrl: 'views/templates/create-update-milestone-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen,
          locals: {
            project: $scope.project,
            milestone: milestone
          }
        })
        .then(function(milestone) {
          // TODO Show annotation created toast
          $log.debug('Dialog returned milestone:', milestone);
        }, function() {
          // Dialog dismissed, do nothing for now
        });
    };

    $scope.$on('tl:timeline:item:add',function(ev, data) {
      ev.preventDefault();
      // Passing in custom event raises an error (it is just an object, not real event)
      if ( data.group === 'timeline-annotations' ) {
        $scope.addOrUpdateAnnotation(null, {
          start: data.start
        });
      } else if ( data.group === 'timeline-milestones' ) {
        $scope.addOrUpdateMilestone(null, {
          start: data.start
        });
      } else {
        $log.error('Unhandled type added', ev, data);
      }
    });

    $scope.$on('tl:timeline:item:update', function(ev, data) {
      ev.preventDefault();
      if ( data.group === 'timeline-annotations' ) {
        $scope.addOrUpdateAnnotation(null, findAnnotationById(data.id));
      } else if ( data.group === 'timeline-milestones' ) {
        $scope.addOrUpdateMilestone(null, findMilestoneById(data.id));
      } else {
        $log.error('Unhandled type updated', ev, data);
      }
    });

    $scope.$on('tl:timeline:item:move', function(ev, data) {
      ev.preventDefault();
      if ( data.group === 'timeline-annotations' ) {
        SocketService.emit('move:annotation', {
          _id: data.id,
          start: data.start
        });
      } else if ( data.group === 'timeline-milestones' ) {
        SocketService.emit('move:milestone', {
          _id: data.id,
          start: data.start
        });
      } else {
        $log.error('Unhandled type moved', ev, data);
      }
    });

    $scope.$on('$destroy', function() {
      // TODO See if more clean-up is required
      SocketService.emit('leave', {
        id: $scope.project._id
      });
      SocketService.off('join', socketJoinCallback);
      SocketService.off('create:annotation', socketCreateAnnotationCallback);
      SocketService.off('update:annotation', socketUpdateAnnotationCallback);
      SocketService.off('delete:annotation', socketDeleteAnnotationCallback);
      SocketService.off('move:annotation', socketMoveAnnotationCallback);
      SocketService.off('create:milestone', socketCreateMilestoneCallback);
      SocketService.off('update:milestone', socketUpdateMilestoneCallback);
      SocketService.off('delete:milestone', socketDeleteMilestoneCallback);
      SocketService.off('move:milestone', socketMoveMilestoneCallback);
    });
  });

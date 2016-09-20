'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ProjectviewCtrl
 * @description
 * # ProjectviewCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ProjectViewCtrl', function ($scope, $stateParams, $log, $mdDialog, $mdMedia, $q, appConfig, ProjectsService, SocketService, _, SystemMessagesService, $) {
    $scope.loadingData = false;
    $scope.fabOpen = false; // TODO this doesn't seem to have an effect, #6788 in md github
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.projectTimelineData = {
      milestones: [],
      annotations: [],
      tasks: [],
      outcomes: []
    };
    $scope.resouces = [];
    $scope.activities = [];
    $scope.messages = [];


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

    function findTaskIndex(task) {
      return _($scope.projectTimelineData.tasks).findIndex(function(o) {
        return o._id === task._id;
      });
    }

    function findTaskById(id) {
      return _($scope.projectTimelineData.tasks).find(function(o) {
        return o._id === id;
      });
    }

    function findResourceIndex(resource) {
      return _($scope.resources).findIndex(function(o) {
        return o._id === resource._id;
      });
    }

    function findOutcomeIndex(outcome) {
      return _($scope.projectTimelineData.outcomes).findIndex(function(o) {
        return o._id === outcome._id;
      });
    }

    function findOutcomeById(id) {
      return _($scope.projectTimelineData.outcomes).find(function(o) {
        return o._id === id;
      });
    }

    function socketConnectCallback() {
      if ( $scope.project ) {
        SocketService.emit('join', {
          id: $scope.project._id
        });
      }
    }

    function socketDisconnectCallback() {
      SocketService.once('connect', socketConnectCallback);
    }

    function socketJoinCallback(data) {
      if ( !data.user && data.success !== true ) {
        SystemMessagesService.showError('TOASTS.ERRORS.SOCKET_JOIN_ERROR');
        $log.debug('Socket JOIN failed', data);
      }
    }

    function socketCreateAnnotationCallback(annotation) {
      $log.debug('Socket create:annotation', annotation);
      $scope.projectTimelineData.annotations.push(annotation);
      $scope.$broadcast('tl:timeline:add:annotation', annotation);
    }

    function socketUpdateAnnotationCallback(annotation) {
      $log.debug('Socket update:annotation', annotation);
      var index = findAnnotationIndex(annotation);
      $scope.projectTimelineData.annotations[index] = annotation;
      $scope.$broadcast('tl:timeline:update:annotation', annotation);
    }

    function socketDeleteAnnotationCallback(annotation) {
      $log.debug('Socket delete:annotation', annotation);
      var index = findAnnotationIndex(annotation);
      $scope.projectTimelineData.annotations.splice(index, 1);
      $scope.$broadcast('tl:timeline:delete:annotation', annotation);
    }

    function socketMoveAnnotationCallback(annotation) {
      $log.debug('Socket move:annotation', annotation);
      var index = findAnnotationIndex(annotation);
      $scope.projectTimelineData.annotations[index].start = annotation.start;
      $scope.$broadcast('tl:timeline:move:annotation', annotation);
    }

    function socketCreateMilestoneCallback(milestone) {
      $log.debug('Socket create:milestone', milestone);
      $scope.projectTimelineData.milestones.push(milestone);
      $scope.$broadcast('tl:timeline:add:milestone', milestone);
    }

    function socketUpdateMilestoneCallback(milestone) {
      $log.debug('Socket update:milestone', milestone);
      var index = findMilestoneIndex(milestone);
      $scope.projectTimelineData.milestones[index] = milestone;
      $scope.$broadcast('tl:timeline:update:milestone', milestone);
    }

    function socketDeleteMilestoneCallback(milestone) {
      $log.debug('Socket delete:milestone', milestone);
      var index = findMilestoneIndex(milestone);
      $scope.projectTimelineData.milestones.splice(index, 1);
      $scope.$broadcast('tl:timeline:delete:milestone', milestone);
    }

    function socketMoveMilestoneCallback(milestone) {
      $log.debug('Socket move:milestone', milestone);
      var index = findMilestoneIndex(milestone);
      $scope.projectTimelineData.milestones[index].start = milestone.start;
      $scope.$broadcast('tl:timeline:move:milestone', milestone);
    }

    function socketCreateTaskCallback(task) {
      $log.debug('Socket create:task', task);
      $scope.projectTimelineData.tasks.push(task);
      $scope.$broadcast('tl:timeline:add:task', task);
    }

    function socketUpdateTaskCallback(task) {
      $log.debug('Socket update:task', task);
      var index = findTaskIndex(task);
      $scope.projectTimelineData.tasks[index] = task;
      $scope.$broadcast('tl:timeline:update:task', task);
    }

    function socketDeleteTaskCallback(task) {
      $log.debug('Socket delete:task', task);
      var index = findTaskIndex(task);
      $scope.projectTimelineData.tasks.splice(index, 1);
      $scope.$broadcast('tl:timeline:delete:task', task);
    }

    function socketMoveTaskCallback(task) {
      $log.debug('Socket move:task', task);
      var index = findTaskIndex(task);
      $scope.projectTimelineData.tasks[index].start = task.start;
      $scope.projectTimelineData.tasks[index].end = task.end;
      $scope.$broadcast('tl:timeline:move:task', task);
    }

    function socketCreateResourceCallback(resource) {
      $log.debug('Socket create:resource', resource);
      $scope.resources.push(resource);
    }

    function socketUpdateResourceCallback(resource) {
      $log.debug('Socket update:resource', resource);
      var index = findResourceIndex(resource);
      $scope.resources[index] = resource;
    }

    function socketDeleteResourceCallback(resource) {
      $log.debug('Socket delete:resource', resource);
      var index = findResourceIndex(resource);
      $scope.resources.splice(index, 1);
    }

    function socketCreateOutcomeCallback(outcome) {
      $log.debug('Socket create:outcome', outcome);
      $scope.projectTimelineData.outcomes.push(outcome);
      $scope.$broadcast('tl:timeline:add:outcome', outcome);
    }

    function socketUpdateOutcomeCallback(outcome) {
      $log.debug('Socket update:outcome', outcome);
      var index = findOutcomeIndex(outcome);
      $scope.projectTimelineData.outcomes[index] = outcome;
      $scope.$broadcast('tl:timeline:update:outcome', outcome);
    }

    function socketDeleteOutcomeCallback(outcome) {
      $log.debug('Socket delete:outcome', outcome);
      var index = findOutcomeIndex(outcome);
      $scope.projectTimelineData.outcomes.splice(index, 1);
      $scope.$broadcast('tl:timeline:delete:outcome', outcome);
    }

    function socketCreateActivityCallback(activity) {
      $log.debug('Socket create:activity', activity);
      $scope.activities.unshift(activity);
    }

    function socketCreateMessageCallback(message) {
      $log.debug('Socket create:message', message);
      $scope.messages.unshift(message);
    }

    if ( $scope.isLoggedIn() ) {
      $scope.loadingData = true;

      var projectResource = ProjectsService.get({ id: $stateParams.id }, function(result) {
        $scope.project = result.data;

        SocketService.emit('join', {
          id: $scope.project._id
        });
        SocketService.on('disconnect', socketDisconnectCallback);
        SocketService.on('join', socketJoinCallback);
        SocketService.on('create:annotation', socketCreateAnnotationCallback);
        SocketService.on('update:annotation', socketUpdateAnnotationCallback);
        SocketService.on('delete:annotation', socketDeleteAnnotationCallback);
        SocketService.on('move:annotation', socketMoveAnnotationCallback);
        SocketService.on('create:milestone', socketCreateMilestoneCallback);
        SocketService.on('update:milestone', socketUpdateMilestoneCallback);
        SocketService.on('delete:milestone', socketDeleteMilestoneCallback);
        SocketService.on('move:milestone', socketMoveMilestoneCallback);
        SocketService.on('create:task', socketCreateTaskCallback);
        SocketService.on('update:task', socketUpdateTaskCallback);
        SocketService.on('delete:task', socketDeleteTaskCallback);
        SocketService.on('move:task', socketMoveTaskCallback);
        SocketService.on('create:resource', socketCreateResourceCallback);
        SocketService.on('update:resource', socketUpdateResourceCallback);
        SocketService.on('delete:resource', socketDeleteResourceCallback);
        SocketService.on('create:outcome', socketCreateOutcomeCallback);
        SocketService.on('update:outcome', socketUpdateOutcomeCallback);
        SocketService.on('delete:outcome', socketDeleteOutcomeCallback);
        SocketService.on('create:activity', socketCreateActivityCallback);
        SocketService.on('create:message', socketCreateMessageCallback);
      }, function(err) {
        // TODO It would make sense to display a meaningful system message if that ever happened
        $log.debug('ERROR getting project', err);
        $scope.loadingData = false;
      });

      // XXX Need to decide when should the Socket kick-in and how to store updates that come before data is loaded
      var milestoneResource = ProjectsService.getProjectMilestones({
        project: $stateParams.id
      }, function(result) {
        $scope.projectTimelineData.milestones = result.data;
        $log.debug('Loaded milestones', result);
      }, function(err) {
        $log.error('ERROR getting project milestones', err);
      });
      var annotationResource = ProjectsService.getProjectAnnotations({
        project: $stateParams.id
      }, function(result) {
        $scope.projectTimelineData.annotations = result.data;
        $log.debug('Loaded annotations', result);
      }, function(err) {
        $log.error('ERROR getting project annotations', err);
      });
      var taskResource = ProjectsService.getProjectTasks({
        project: $stateParams.id
      }, function(result) {
        $scope.projectTimelineData.tasks = result.data;
        $log.debug('Loaded tasks', result);
      }, function(err) {
        $log.error('ERROR getting project tasks', err);
      });
      var resourceResource = ProjectsService.getProjectResources({
        project: $stateParams.id
      }, function(result) {
        $scope.resources = result.data;
        $log.debug('Loaded resources', result);
      }, function(err) {
        $log.error('ERROR getting project resources', err);
      });
      var outcomeResource = ProjectsService.getProjectOutcomes({
        project: $stateParams.id
      }, function(result) {
        $scope.projectTimelineData.outcomes = result.data;
        $log.debug('Loaded outcomes', result);
      }, function(err) {
        $log.error('ERROR getting project outcomes', err);
      });
      var activityResource = ProjectsService.getProjectActivities({
        project: $stateParams.id
      }, function(result) {
        $scope.activities = result.data;
        $log.debug('Loaded activities', result);
      }, function(err) {
        $log.error('ERROR getting project activities', err);
      });
      var messageResource = ProjectsService.getProjectMessages({
        project: $stateParams.id
      }, function(result) {
        $scope.messages = result.data;
      }, function(err) {
        $log.error('ERROR getting project activities', err);
      });

      // Make sure to signal end of data loading
      $q.all([projectResource.$promise,
        milestoneResource.$promise,
        annotationResource.$promise,
        taskResource.$promise,
        resourceResource.$promise,
        outcomeResource.$promise,
        activityResource.$promise,
        messageResource.$promise]
      ).then(function() {
        $scope.loadingData = false;
      }, function() {
        $scope.loadingData = false;
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
          // TODO Show milestone created toast
          $log.debug('Dialog returned milestone:', milestone);
        }, function() {
          // Dialog dismissed, do nothing for now
        });
    };

    $scope.addOrUpdateTask = function(ev, task) {
      $mdDialog.show({
          controller: 'CreateUpdateTaskDialogCtrl',
          templateUrl: 'views/templates/create-update-task-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen,
          locals: {
            project: $scope.project,
            task: task
          }
        })
        .then(function(task) {
          // TODO Show task created toast
          $log.debug('Dialog returned task:', task);
        }, function() {
          // Dialog dismissed, do nothing for now
        });
    };

    $scope.addOrUpdateResource = function(ev, resource) {
      $mdDialog.show({
          controller: 'CreateUpdateResourceDialogCtrl',
          templateUrl: 'views/templates/create-update-resource-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen,
          locals: {
            project: $scope.project,
            resource: resource
          }
        })
        .then(function(resource) {
          // TODO Show resource created toast
          $log.debug('Dialog returned resource:', resource);
        }, function() {
          // Dialog dismissed, do nothing for now
        });
    };

    $scope.addOrUpdateOutcome = function(ev, outcome) {
      $mdDialog.show({
          controller: 'CreateUpdateOutcomeDialogCtrl',
          templateUrl: 'views/templates/create-update-outcome-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen,
          locals: {
            project: $scope.project,
            outcome: outcome
          }
        })
        .then(function(outcome) {
          $log.debug('Dialog returned outcome:', outcome);
        }, function() {
          // Dialog dismissed, do nothing for now
        });
    };

    $scope.timelineMoveLeft = function(ev) {
      $scope.$broadcast('tl:timeline:move_left', ev);
    };

    $scope.timelineMoveRight = function(ev) {
      $scope.$broadcast('tl:timeline:move_right', ev);
    };

    $scope.timelineZoomIn = function(ev) {
      $scope.$broadcast('tl:timeline:zoom_in', ev);
    };

    $scope.timelineZoomOut = function(ev) {
      $scope.$broadcast('tl:timeline:zoom_out', ev);
    };

    $scope.timelineFitToScreen = function(ev) {
      $scope.$broadcast('tl:timeline:fit_to_screen', ev);
    };

    $scope.resetPanels = function(ev) {
      $log.error('Not implemented', ev);
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
      } else if ( data.group === 'timeline-tasks' ) {
        // TODO Make sure to determine the end date in a better way
        $scope.addOrUpdateTask(null, {
          start: data.start,
          end: new Date( (new Date(data.start)).valueOf() +  ( 1 * 24 * 60 * 60 * 1000 ) )
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
      } else if ( data.group === 'timeline-tasks' ) {
        $scope.addOrUpdateTask(null, findTaskById(data.id));
      } else if ( data.group === 'timeline-outcomes' ) {
        $scope.addOrUpdateOutcome(null, findOutcomeById(data.id));
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
      } else if ( data.group === 'timeline-tasks' ) {
        SocketService.emit('move:task', {
          _id: data.id,
          start:data.start,
          end: data.end
        });
      } else {
        $log.error('Unhandled type moved', ev, data);
      }
    });

    $(document).on('tl:timeline:item:addObject', function(ev, data) {

      // TODO check if already exists before sending data

      var objectType;

      if(data.dragType === 'participant'){
        objectType = 'participants';
      } else if (data.dragType === 'resource') {
        objectType = 'resources';
      } else if (data.dragType === 'outcome') {
        objectType = 'outcomes';
      }

      if(data.dropType === 'task'){
        ProjectsService.addObjectToTask({
          project: $scope.project._id,
          task: data.dropId,
          objectType: objectType,
          objectId: data.dragId
        }, {}, function() {
          //$log.debug('Task update success', response);
          //SystemMessagesService.showSuccess('TOASTS.SUCCESSES.TASK_UPDATED');
        }, function(err) {
          if (err.status === 409) {
            if (data.dragType === 'participant') {
              SystemMessagesService.showError('TOASTS.ERRORS.PARTICIPANT_EXISTS');
            } else if (data.dragType === 'resource') {
              SystemMessagesService.showError('TOASTS.ERRORS.RESOURCE_EXISTS');
            } else if (data.dragType === 'outcome') {
              SystemMessagesService.showError('TOASTS.ERRORS.OUTCOME_EXISTS');
            }

          } else {
            $log.error('Task update error', err);
            SystemMessagesService.showError('TOASTS.ERRORS.SERVER_ERROR');
          }
        });
      }
    });

    $scope.$on('$destroy', function() {
      // TODO See if more clean-up is required
      SocketService.emit('leave', {
        id: $scope.project._id
      });
      SocketService.off('disconnect', socketDisconnectCallback);
      SocketService.off('join', socketJoinCallback);
      SocketService.off('create:annotation', socketCreateAnnotationCallback);
      SocketService.off('update:annotation', socketUpdateAnnotationCallback);
      SocketService.off('delete:annotation', socketDeleteAnnotationCallback);
      SocketService.off('move:annotation', socketMoveAnnotationCallback);
      SocketService.off('create:milestone', socketCreateMilestoneCallback);
      SocketService.off('update:milestone', socketUpdateMilestoneCallback);
      SocketService.off('delete:milestone', socketDeleteMilestoneCallback);
      SocketService.off('move:milestone', socketMoveMilestoneCallback);
      SocketService.off('create:task', socketCreateTaskCallback);
      SocketService.off('update:task', socketUpdateTaskCallback);
      SocketService.off('delete:task', socketDeleteTaskCallback);
      SocketService.off('move:task', socketMoveTaskCallback);
      SocketService.off('create:resource', socketCreateResourceCallback);
      SocketService.off('update:resource', socketUpdateResourceCallback);
      SocketService.off('delete:resource', socketDeleteResourceCallback);
      SocketService.off('create:outcome', socketCreateOutcomeCallback);
      SocketService.off('update:outcome', socketUpdateOutcomeCallback);
      SocketService.off('delete:outcome', socketDeleteOutcomeCallback);
      SocketService.off('create:activity', socketCreateActivityCallback);
      SocketService.off('create:message', socketCreateMessageCallback);
    });
  });

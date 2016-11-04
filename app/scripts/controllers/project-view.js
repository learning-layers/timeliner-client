'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ProjectviewCtrl
 * @description
 * # ProjectviewCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ProjectViewCtrl', function ($scope, $stateParams, $log, $mdDialog, $mdMedia, $q, appConfig, ProjectsService, SocketService, _, SystemMessagesService, $, dialogHelper, project, $window, $timeout) {

    /*
     *
     * Set up objects and arrays
     *
     */

    $scope.loadingData = false;
    $scope.fabOpen = false; // TODO this doesn't seem to have an effect, #6788 in md github
    $scope.projectTimelineData = {
      milestones: [],
      annotations: [],
      tasks: [],
      outcomes: []
    };
    $scope.resouces = [];
    $scope.activities = [];
    $scope.moreActivitiesLeft = true;
    $scope.messages = [];
    $scope.moreMessagesLeft = true;

    $scope.project = project;
    ProjectsService.setCurrentProject(project);

    // Variables for panels placement
    var windowWidth = $(window).width();
    var panelMarginLeft = 50;
    var defaultPanelWidth = 300;
    var defaultPanelHeight = 0;

    function resetPanels() {
      $scope.panelStates = {
        participantPanel: {
          collapsed: true,
          moved: false
        },
        resourcePanel: {
          collapsed: true,
          moved: false
        },
        outcomePanel: {
          collapsed: true,
          moved: false
        },
        taskPanel: {
          collapsed: true,
          moved: false
        },
        feedPanel: {
          collapsed: true,
          moved: false
        }
      };

      $('.floating .ui-resizable-handle').hide();

      windowWidth = $(window).width();
      var horizontalPlacement = windowWidth - panelMarginLeft - defaultPanelWidth;
      $('.floating').animate({left: horizontalPlacement, height: defaultPanelHeight, width: defaultPanelWidth});

      $('#participantPanel').show().animate({top: 150});
      $('#resourcePanel').show().animate({top: 250});
      $('#outcomePanel').show().animate({top: 350});
      $('#taskPanel').show().animate({top: 450});
      $('#feedPanel').show().animate({top: 550});
    }

    resetPanels();

    $( '.floating' ).draggable({
      handle: 'md-toolbar',
      containment: 'body',
      scroll: false,
      stack: '.floating',
      start: function() {
        $scope.panelStates[this.id].moved = true;
      }
    }).resizable({
      handles: 'se',
      minHeight: 150,
      minWidth: 200,
      maxWidth: 600
    });


    function onResize() {
      // Reset timeout
      $timeout.cancel($scope.resizing);

      // Add a timeout to not call the resizing function every pixel
      $scope.resizing = $timeout( function() {
        windowWidth = $(window).width();
        var horizontalPlacement = windowWidth - panelMarginLeft - defaultPanelWidth;

        $('.floating').each(
          function () {
            if(!$scope.panelStates[this.id].moved){
              $(this).animate({left: horizontalPlacement});
            }
          }
        );
      }, 500);
    }

    angular.element($window).on('resize', onResize);

    function setFeedPanelScroll(that) {
      var height = $(that).height();
      var tabsHeight = $(that).find('md-tabs-wrapper').first().outerHeight();

      $('#tl-project-messages').css('max-height', height - tabsHeight - $(that).find('#chatField').outerHeight());
      $('#tl-project-activities').css('max-height', height - tabsHeight);
    }

    $( "#feedPanel" ).on('resize', function() {
      setFeedPanelScroll(this);
    });



    /*
     *
     * Global functions for drag/drop functionality between Angular and Vis.js
     *
     */

    window.tlCurrentDragData = {};

    window.checkDropability = function (ev, el) {
      window.tlCurrentDragData.containsItem = _.some(
        findTaskById($(el).data('tlDropId'))[getObjectArrayName(window.tlCurrentDragData.DragType)],
        {_id: window.tlCurrentDragData.DragId}
      );
    };

    window.allowDrop = function(ev, el){
      if(!window.tlCurrentDragData.containsItem){
        ev.preventDefault();
        $(el).addClass('drop-target');
      }
    };

    window.objectDragStart = function (ev) {
      window.tlCurrentDragData.DragId = ev.target.dataset.tlDragId;
      window.tlCurrentDragData.DragType = ev.target.dataset.tlDragType;

      ev.dataTransfer.setData('application/json', JSON.stringify({
        tlDragId: ev.target.dataset.tlDragId,
        tlDragType: ev.target.dataset.tlDragType
      }));
    };

    window.dragTargetEnd = function(ev, el){
      $(el).removeClass('drop-target');
    };

    window.objectDropped = function (ev, el) {
      ev.preventDefault();
      var target = $(el);
      target.removeClass('drop-target');
      var dragDropData = {};

      $log.debug(JSON.parse(ev.dataTransfer.getData('application/json')).tlDragType);
      //return;
      dragDropData.dragId = JSON.parse(ev.dataTransfer.getData('application/json')).tlDragId;
      dragDropData.dragType = JSON.parse(ev.dataTransfer.getData('application/json')).tlDragType;
      dragDropData.dropId = target.data('tlDropId');
      dragDropData.dropType = target.data('tlDropType');

      //$log.debug('dropped: ', dragDropData.dragType, dragDropData.dragId, 'on target', dragDropData.dropType, dragDropData.dropId);

      $(document).trigger('tl:timeline:item:addObject', dragDropData);
    };


    function getObjectArrayName(objectType) {
      if (objectType === 'participant') {
        return 'participants';
      } else if (objectType === 'resource') {
        return 'resources';
      } else if (objectType === 'outcome') {
        return 'outcomes';
      }
    }



    /*
     *
     * Helper functions of controller
     *
     */

    function getDataSourceByItemType(type) {
      var source;

      switch(type) {
        case 'annotation':
          source = $scope.projectTimelineData.annotations;
          break;
        case 'milestone':
          source = $scope.projectTimelineData.milestones;
          break;
        case 'task':
          source = $scope.projectTimelineData.tasks;
          break;
        case 'resource':
          source = $scope.projectTimelineData.resouces;
          break;
        case 'outcome':
          source = $scope.projectTimelineData.outcomes;
          break;
        case 'participant':
         source = $scope.project.participants;
         break;
        default:
          throw 'Unknown object type';
      }

      return source;
    }

    function findItemIndex(type, item) {
      var source = getDataSourceByItemType(type);

      return _(source).findIndex(function(o) {
        return o._id === item._id;
      });
    }

    function findItemById(type, id) {
      var source = getDataSourceByItemType(type);

      return _(source).find(function(o) {
        return o._id === id;
      });
    }

    function findAnnotationIndex(annotation) {
      return findItemIndex('annotation', annotation);
    }

    function findAnnotationById(id) {
      return findItemById('annotation', id);
    }

    function findMilestoneIndex(milestone) {
      return findItemIndex('milestone', milestone);
    }

    function findMilestoneById(id) {
      return findItemById('milestone', id);
    }

    function findTaskIndex(task) {
      return findItemIndex('task', task);
    }

    function findTaskById(id) {
      return findItemById('task', id);
    }

    function findResourceIndex(resource) {
      return findItemIndex('resource', resource);
    }

    function findOutcomeIndex(outcome) {
      return findItemIndex('outcome', outcome);
    }

    function findOutcomeById(id) {
      return findItemById('outcome', id);
    }

    function findParticipantIndex(participant) {
      return findItemIndex('participant', participant);
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

    function socketUpdateProjectCallback(project) {
      $scope.project = project;
      ProjectsService.setCurrentProject($scope.project);
    }

    function socketDeleteProjectCallback(project) {
      $log.error('Handling of delete project needed', project);
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

    function socketAddParticipantCallback(participant) {
      $scope.project.participants.push(participant);
    }

    function socketUpdateParticipantCallback(participant) {
      var index = findParticipantIndex(participant);
      $scope.project.participants[index] = participant;
    }

    function socketEmitJoinAndSetupListeners() {
      SocketService.emit('join', {
        id: $scope.project._id
      });
      SocketService.on('disconnect', socketDisconnectCallback);
      SocketService.on('join', socketJoinCallback);
      SocketService.on('update:project', socketUpdateProjectCallback);
      SocketService.on('delete:project', socketDeleteProjectCallback);
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
      SocketService.on('invite:participant', socketAddParticipantCallback);
      SocketService.on('update:participant', socketUpdateParticipantCallback);
    }

    // Setup and load additional data
    socketEmitJoinAndSetupListeners();

    $scope.loadingData = true;
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
      project: $stateParams.id,
      limit: appConfig.paginationSize
    }, function(result) {
      $scope.activities = result.data.activities;
      if ( result.data.remaining === 0 ) {
        $scope.moreActivitiesLeft = false;
      }
    }, function(err) {
      $log.error('ERROR getting project activities', err);
    });
    var messageResource = ProjectsService.getProjectMessages({
      project: $stateParams.id,
      limit: appConfig.paginationSize
    }, function(result) {
      $scope.messages = result.data.messages;
      if ( result.data.remaining === 0 ) {
        $scope.moreMessagesLeft = false;
      }
    }, function(err) {
      $log.error('ERROR getting project messages', err);
    });

    $q.all([milestoneResource.$promise,
      annotationResource.$promise,
      taskResource.$promise,
      resourceResource.$promise,
      outcomeResource.$promise,
      activityResource.$promise,
      messageResource.$promise]
    ).then(function() {
      $scope.loadingData = false;
    }, function() {
      // TODO Might make sense to signal data loading issues
      $scope.loadingData = false;
    });

    // Attach methods to $scope
    $scope.addOrUpdateAnnotation = function(ev, annotation) {
      $mdDialog.show({
          controller: 'CreateUpdateAnnotationDialogCtrl',
          templateUrl: 'views/templates/create-update-annotation-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: dialogHelper.getUseFullScreen(),
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
          fullscreen: dialogHelper.getUseFullScreen(),
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
          fullscreen: dialogHelper.getUseFullScreen(),
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
          fullscreen: dialogHelper.getUseFullScreen(),
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
          fullscreen: dialogHelper.getUseFullScreen(),
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

    $scope.timelineMoveLeft = function() {
      $scope.$broadcast('tl:timeline:move_left');
    };

    $scope.timelineMoveRight = function() {
      $scope.$broadcast('tl:timeline:move_right');
    };

    $scope.timelineZoomIn = function() {
      $scope.$broadcast('tl:timeline:zoom_in');
    };

    $scope.timelineZoomOut = function() {
      $scope.$broadcast('tl:timeline:zoom_out');
    };

    $scope.timelineFitToScreen = function() {
      $scope.$broadcast('tl:timeline:fit_to_screen');
    };

    $scope.showOnTimeline = function(ev, activity) {
       if ( activity.data.id ) {
         var item = findItemById(activity.objectType, activity.data.id);

         if ( item && item.start ) {
           $scope.$broadcast('tl:timeline:focus', { id: item._id });
         }
       }
    };

    $scope.resetPanels = function() {
      resetPanels();
    };

    // Attach event listeners to $scope
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

      var objectType = getObjectArrayName(data.dragType);

      if(data.dropType === 'task'){
        ProjectsService.addObjectToTask({
          project: $scope.project._id,
          task: data.dropId,
          objectType: objectType,
          objectId: data.dragId
        }, {}, function() {
          //$log.debug('Task update success', response);
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
            SystemMessagesService.showError('TOASTS.ERRORS.INTERNAL_SERVER_ERROR');
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
      SocketService.off('update:project', socketUpdateProjectCallback);
      SocketService.off('delete:project', socketDeleteProjectCallback);
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
      SocketService.off('invite:participant', socketAddParticipantCallback);
      SocketService.off('update:participant', socketUpdateParticipantCallback);

      ProjectsService.unsetCurrentProject();

      $(document).off('tl:timeline:item:addObject');
      angular.element($window).off('resize');
    });
  });

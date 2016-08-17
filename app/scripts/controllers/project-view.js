'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ProjectviewCtrl
 * @description
 * # ProjectviewCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ProjectViewCtrl', function ($scope, $stateParams, $log, $mdDialog, $mdMedia, appConfig, ProjectsService, SocketService) {
    $scope.fabOpen = false; // TODO this doesn't seem to have an effect, #6788 in md github
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.projectTimelineData = {
      annotations: []
    };

    var socketJoinCallback = function(data) {
      $log.debug('Socket JOIN', data);
    };

    var socketCreateAnnotationCallback = function(annotation) {
      $log.debug('Socket create:annotation', annotation);
      $scope.projectTimelineData.annotations.push(annotation);
      $scope.$broadcast('tl:timeline:add:annotation', annotation);
    };

    var socketUpdateAnnotationCallback = function(data) {
      $log.debig('Socket update:annotation', data);
    };

    var socketDeleteAnnotationCallback = function(data) {
      $log.debug('Socket delete:annotation', data);
    };

    // XXX Thsi should probably be fully moving through Socket
    var socketMoveAnnotationCallback = function(data) {
      $log.debug('Socket move:annotation', data);
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
      }, function(err) {
        // TODO It would make sense to display a meaningful system message if that ever happened
        $log.debug('ERROR getting project', err);
      });
      ProjectsService.getProjectAnnotations({ project: $stateParams.id }, function(result) {
        $scope.projectTimelineData.annotations = result.data;
        $log.debug(result);
      }, function(err) {
        $log.debug('ERROR getting project annotations', err);
      });
    }

    $scope.addAnnotation = function(ev, item) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      $mdDialog.show({
          controller: 'CreateNewAnnotationModalInstanceCtrl',
          templateUrl: 'views/templates/create-new-annotation-modal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen,
          locals: {
            project: $scope.project,
            start: ( item && item.start ) ? new Date( item.start ) : null
          }
        })
        .then(function(annotation) {
          // TODO Show annotation created toast
          $log.debug('Dialog returned annotation:', annotation);
        }, function() {
          $log.debug('Dialog dismissed.');
        });

      $scope.$watch(function() { // TODO decide if this $mdMedia watcher is necessary
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    $scope.$on('tl:timeline:item:add',function(ev, data) {
      ev.preventDefault();
      // Passing in custom event raises an error (it is just an object, not real event)
      if ( data.group === 'timeline-annotations' ) {
        $scope.addAnnotation(null, data);
      } else {
        $log.error('Unhandled type added', ev, data);
      }
    });

    $scope.$on('tl:timeline:item:update', function(ev, data) {
      ev.preventDefault();
      $log.debug(ev, data);
      // TODO Need to edit an object
    });

    $scope.$on('tl:timeline:item:move', function(ev, data) {
      ev.preventDefault();
      $log.debug(ev, data);
      // TODO Need to handle moved
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
    });
  });

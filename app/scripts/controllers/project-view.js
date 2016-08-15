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

    if ( $scope.isLoggedIn() ) {
      ProjectsService.get({id: $stateParams.id}, function(result) {
        $scope.project = result.data;

        SocketService.emit('join', {
          id: $scope.project._id
        });
        SocketService.on('join', socketJoinCallback);
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

    $scope.addAnnotation = function(ev, data) {
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
            date: ( data && data.item && data.item.start ) ? new Date( data.item.start ) : null
          }
        })
        .then(function(annotation) {
          $log.debug('Dialog returned annotation:', annotation);
          $scope.projectTimelineData.annotations.push(annotation);
          data.item.title = annotation.title;
          data.item.description = annotation.description;
          data.item.id = annotation._id;
          data.callback(data.item);
        }, function() {
          $log.debug('Dialog dismissed.');
        });

      $scope.$watch(function() { // TODO decide if this $mdMedia watcher is necessary
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    $scope.$on('timeliner:timeline:item:add',function(ev, data) {
      ev.preventDefault();
      // TODO Looks like we would need to handle the callback here
      $log.debug(ev, data);
      // Passing in custom event raises an error (it is just an object, not real event)
      $scope.addAnnotation(null, data);
    });

    $scope.$on('$destroy', function() {
      // TODO See if more clean-up is required
      SocketService.emit('leave', {
        id: $scope.project._id
      });
      SocketService.off('join', socketJoinCallback);
    });
  });

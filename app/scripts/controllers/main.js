'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('MainCtrl', function ($scope, $log, $filter, ProjectsService, AuthService, $mdDialog, $mdMedia) {
    $scope.projects = [];

    $scope.canDeleteProject = function(project) {
      var currentUser = AuthService.getCurrentUser();

      return project.owner._id === currentUser._id;
    };

    $scope.canLeaveProject = function(project) {
      var currentUser = AuthService.getCurrentUser();

      return project.owner._id !== currentUser._id;
    };

    $scope.displayDate = function(dateString) {
      if ( dateString ) {
        return $filter('date')(new Date(dateString), 'dd.MM.yyyy');
      }

      return dateString;
    };

    $scope.displayParticipants = function(participants) {
      if ( participants && participants.length > 0 ) {
        var names = [];
        angular.forEach(participants, function(participant) {
          names.push(participant.user.name.first + ' ' + participant.user.name.last);
        });

        return names.join(', ');
      }

      return '';
    };

    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.createNewProject = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      $mdDialog.show({
          controller: 'CreateNewProjectModalInstanceCtrl',
          templateUrl: 'views/templates/create-new-project-modal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        })
        .then(function(project) {
          $log.debug('Dialog returned project:', project);
          $scope.projects.push(project);
        }, function() {
          $log.debug('Dialog dismissed.');
        });

      $scope.$watch(function() { // TODO decide if this $mdMedia watcher is necessary
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    $scope.doEdit = function(project) {
      $log.debug('Edit called for project', project);
    };

    $scope.doLeave = function(project) {
      $log.debug('Leave called for project', project);
    };

    $scope.doDelete = function(project) {
      $log.debug('Delete called for project', project);
    };

    if ( $scope.isLoggedIn() ) {
      ProjectsService.mine({}, function(result) {
        $scope.projects = result.data;
      }, function(err) {
        $log.debug('My projects ERROR', err);
      });
    }
  });

'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('MainCtrl', function ($scope, $log, $filter, ProjectsService, AuthService, $mdDialog, $mdMedia, _) {
    function findCurrentParticipant(project) {
      var currentUser = AuthService.getCurrentUser();

      return _.find(project.participants, function(participant) {
        return participant.user._id === currentUser._id;
      });
    }

    $scope.pendingProjects = [];
    $scope.activeProjects = [];

    $scope.updating = false;

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
          $scope.activeProjects.push(project);
        }, function() {
          $log.debug('Dialog dismissed.');
        });

      $scope.$watch(function() { // TODO decide if this $mdMedia watcher is necessary
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    $scope.doJoin = function(project, index) {
      // TODO Ask for confirmation
      $scope.updating = true;

      ProjectsService.accept({
        id: project._id
      }, {}, function() {
        $scope.pendingProjects.splice(index, 1);

        var currentParticipant = findCurrentParticipant(project);
        currentParticipant.status = 'active';

        $scope.activeProjects.push(project);
        $scope.updating = false;
      }, function(response) {
        // TODO Handle error
        $log.debug(response);
        $scope.updating = false;
      });
    };

    $scope.doDecline = function(project, index) {
      // TODO Ask for confirmation
      $scope.updating = true;

      ProjectsService.reject({
        id: project._id
      }, {}, function() {
        $scope.pendingProjects.splice(index, 1);
        $scope.updating = false;
      }, function(response) {
        // TODO Handle error
        $log.debug(response);
        $scope.updating = false;
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
        if ( result.data.length > 0 ) {
          var pendingProjects = [];
          var activeProjects = [];

          angular.forEach(result.data, function(project) {
            var currentParticipant = findCurrentParticipant(project);

            // TODO See if it makes semse to also determine active status
            // This way some strange cases would just be left out
            if ( currentParticipant.status === 'pending' ) {
              pendingProjects.push(project);
            } else {
              activeProjects.push(project);
            }
          });

          $scope.pendingProjects = pendingProjects;
          $scope.activeProjects = activeProjects;
        }
      }, function(err) {
        $log.debug('My projects ERROR', err);
      });
    }
  });

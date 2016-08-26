'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ProjectListCtrl', function ($scope, $log, $filter, $state, ProjectsService, AuthService, $mdDialog, $mdMedia, _, $translate) {
    $scope.pendingProjects = [];
    $scope.activeProjects = [];
    $scope.allProjects = [];

    $scope.updating = false;

    $scope.switchListingView = function(state) {
      if ( $state.current.name !== state ) {
        $state.go(state);
      }
    };

    $scope.isActiveListingView = function(state) {
      return $state.current.name === state;
    };

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
          clickOutsideToClose: false,
          fullscreen: useFullScreen,
          locals: {
            project: null
          }
        })
        .then(function(project) {
          $log.debug('Dialog returned project:', project);
          $scope.activeProjects.push(project);
          $scope.allProjects.push(project);
        }, function() {
          $log.debug('Dialog dismissed.');
        });

      $scope.$watch(function() { // TODO decide if this $mdMedia watcher is necessary
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    $scope.doJoin = function(project, index, ev) {
      $mdDialog.show(
        $mdDialog.confirm()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title($translate.instant('VIEWS.PROJECT_LIST.JOIN_DIALOG.TITLE'))
          .textContent($translate.instant('VIEWS.PROJECT_LIST.JOIN_DIALOG.TEXT'))
          .ariaLabel($translate.instant('VIEWS.PROJECT_LIST.JOIN_DIALOG.ARIA_LABEL'))
          .targetEvent(ev)
          .ok($translate.instant('GENERAL.CONFIRM'))
          .cancel($translate.instant('GENERAL.CLOSE'))
      ).then(function() {
        $scope.updating = true;

        ProjectsService.accept({
          id: project._id
        }, {}, function() {
          $scope.pendingProjects.splice(index, 1);

          var currentParticipant = ProjectsService.findCurrentParticipant(project);
          currentParticipant.status = 'active';

          $scope.activeProjects.push(project);
          $scope.updating = false;
        }, function(response) {
          // TODO Handle error
          $log.debug(response);
          $scope.updating = false;
        });
      });
    };

    $scope.doDecline = function(project, index, ev) {
      $mdDialog.show(
        $mdDialog.confirm()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title($translate.instant('VIEWS.PROJECT_LIST.DECLINE_DIALOG.TITLE'))
          .textContent($translate.instant('VIEWS.PROJECT_LIST.DECLINE_DIALOG.TEXT'))
          .ariaLabel($translate.instant('VIEWS.PROJECT_LIST.DECLINE_DIALOG.ARIA_LABEL'))
          .targetEvent(ev)
          .ok($translate.instant('GENERAL.CONFIRM'))
          .cancel($translate.instant('GENERAL.CLOSE'))
      ).then(function() {
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
      });
    };

    $scope.doEdit = function(project, ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
      var projectId = project._id;
      $mdDialog.show({
          controller: 'CreateNewProjectModalInstanceCtrl',
          templateUrl: 'views/templates/create-new-project-modal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: useFullScreen,
          locals: {
            project: project
          }
        })
        .then(function(project) {
          $log.debug('Dialog returned project:', project);
          $scope.activeProjects[_($scope.activeProjects).findIndex(function(p) { return p._id === projectId; })] = project;
          $scope.allProjects[_($scope.allProjects).findIndex(function(p) { return p._id === projectId; })] = project;
        }, function() {
          $log.debug('Dialog dismissed.');
        });

      $scope.$watch(function() { // TODO decide if this $mdMedia watcher is necessary
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    $scope.doLeave = function(project, index, ev) {
      $log.debug('Leave called for project', project, index, ev);
    };

    $scope.doDelete = function(project, index, ev) {
      $log.debug('Delete called for project', project, index, ev);
    };

    $scope.doShowOnTimeline = function(project, ev) {
      var currentParticipant = ProjectsService.findCurrentParticipant(project);

      $mdDialog.show(
        $mdDialog.confirm()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title($translate.instant('VIEWS.PROJECT_LIST.TIMELINE_SHOW_DIALOG.TITLE'))
          .textContent($translate.instant('VIEWS.PROJECT_LIST.TIMELINE_SHOW_DIALOG.TEXT'))
          .ariaLabel($translate.instant('VIEWS.PROJECT_LIST.TIMELINE_SHOW_DIALOG.ARIA_LABEL'))
          .targetEvent(ev)
          .ok($translate.instant('GENERAL.CONFIRM'))
          .cancel($translate.instant('GENERAL.CLOSE'))
      ).then(function() {
        $scope.updating = true;

        ProjectsService.show({
          id: project._id
        }, {}, function() {
          currentParticipant.showOnTimeline = true;
          $scope.updating = false;
        }, function(response) {
          // TODO Handle error
          $log.debug(response);
          $scope.updating = false;
        });
      });
    };

    $scope.doHideFromTimeline = function(project, ev) {
      var currentParticipant = ProjectsService.findCurrentParticipant(project);

      $mdDialog.show(
        $mdDialog.confirm()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title($translate.instant('VIEWS.PROJECT_LIST.TIMELINE_HIDE_DIALOG.TITLE'))
          .textContent($translate.instant('VIEWS.PROJECT_LIST.TIMELINE_HIDE_DIALOG.TEXT'))
          .ariaLabel($translate.instant('VIEWS.PROJECT_LIST.TIMELINE_HIDE_DIALOG.ARIA_LABEL'))
          .targetEvent(ev)
          .ok($translate.instant('GENERAL.CONFIRM'))
          .cancel($translate.instant('GENERAL.CLOSE'))
      ).then(function() {
        $scope.updating = true;

        ProjectsService.hide({
          id: project._id
        }, {}, function() {
          currentParticipant.showOnTimeline = false;
          $scope.updating = false;
        }, function(response) {
          // TODO Handle error
          $log.debug(response);
          $scope.updating = false;
        });
      });
    };

    $scope.isShownOnTimeline = function(project) {
      return ProjectsService.isShownOnTimeline(project);
    };

    $scope.openProjectMenu = function(ev, $mdOpenMenu) {
      if ( ev.target.nodeName.toLowerCase() === 'md-icon' ) {
        $mdOpenMenu(ev);
      }
    };

    if ( $scope.isLoggedIn() ) {
      ProjectsService.mine({}, function(result) {
        if ( result.data.length > 0 ) {
          var pendingProjects = [];
          var activeProjects = [];

          $scope.allProjects = result.data;

          angular.forEach(result.data, function(project) {
            var currentParticipant = ProjectsService.findCurrentParticipant(project);

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

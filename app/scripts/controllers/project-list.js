'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ProjectListCtrl', function ($scope, $log, $filter, $state, ProjectsService, AuthService, $mdDialog, $mdMedia, _, $translate, dialogHelper, SystemMessagesService) {
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

    $scope.createNewProject = function(ev) {
      $mdDialog.show({
          controller: 'CreateUpdateProjectDialogCtrl',
          templateUrl: 'views/templates/create-update-project-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: dialogHelper.getUseFullScreen(),
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
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response));
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
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response));
          $scope.updating = false;
        });
      });
    };

    $scope.doEdit = function(project, ev) {
      var dialogPromise = dialogHelper.openProjectEditDialog(project, ev);

      dialogPromise.then(function(project) {
          $log.debug('Dialog returned project:', project);
          $scope.activeProjects[_($scope.activeProjects).findIndex(function(p) { return p._id === project._id; })] = project;
          $scope.allProjects[_($scope.allProjects).findIndex(function(p) { return p._id === project._id; })] = project;
        }, function() {
          $log.debug('Dialog dismissed.');
        });
    };

    $scope.doLeave = function(project, index, ev) {
      $mdDialog.show(
        $mdDialog.confirm()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title($translate.instant('VIEWS.PROJECT_LIST.LEAVE_DIALOG.TITLE'))
          .textContent($translate.instant('VIEWS.PROJECT_LIST.LEAVE_DIALOG.TEXT'))
          .ariaLabel($translate.instant('VIEWS.PROJECT_LIST.LEAVE_DIALOG.ARIA_LABEL'))
          .targetEvent(ev)
          .ok($translate.instant('GENERAL.CONFIRM'))
          .cancel($translate.instant('GENERAL.CLOSE'))
      ).then(function() {
        $scope.updating = true;

        ProjectsService.leave({
          id: project._id
        }, {}, function() {
          $scope.activeProjects.splice(index, 1);
          $scope.updating = false;
        }, function(response) {
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response));
          $scope.updating = false;
        });
      });
    };

    $scope.doDelete = function(project, index, ev) {
      $log.error('Not implemented');
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
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response));
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
          SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response));
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
      }, function(response) {
        SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(response));
      });
    }
  });

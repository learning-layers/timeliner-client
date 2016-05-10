'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('MainCtrl', function ($scope, $uibModal, $log, $filter, ProjectsService, AuthService) {
    $scope.projects = [];

    $scope.canDeleteProject = function(project) {
      var currentUser = AuthService.getCurrentUser();

      if ( project.owner._id === currentUser._id ) {
        return true;
      }

      return false;
    };

    $scope.canLeaveProject = function(project) {
      var currentUser = AuthService.getCurrentUser();

      if ( project.owner._id !== currentUser._id ) {
        return true;
      }

      return false;
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
          names.push(participant.name.first + ' ' + participant.name.last);
        });

        return names.join(', ');
      }

      return '';
    };

    $scope.createNewProject = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/templates/create-new-project-modal.html',
        controller: 'CreateNewProjectModalInstanceCtrl',
      });

      modalInstance.result.then(function(project) {
        $log.debug('Modal action called:', project);
        $scope.projects.push(project);
      }, function() {
        $log.debug('Modal dismissed.');
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

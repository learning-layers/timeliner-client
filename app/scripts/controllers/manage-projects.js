'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ManageProjectsCtrl
 * @description
 * # ManageProjectsCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ManageProjectsCtrl', function ($scope, $state, $log, ProjectsService) {
    $scope.goBack = function() {
      $state.go('manage.main');
    };

    ProjectsService.all({}, function(result) {
      $log.debug(result);
      $scope.projects = result.data;
    }, function(result) {
      $log.debug(result);
    });
  });

'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ManageProjectsCtrl
 * @description
 * # ManageProjectsCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ManageProjectsCtrl', function ($scope, $log, ProjectsService) {
    ProjectsService.all({}, function(result) {
      $log.debug(result);
      $scope.projects = result.data;
    }, function(result) {
      $log.debug(result);
    });
  });

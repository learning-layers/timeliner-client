'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ProjectviewCtrl
 * @description
 * # ProjectviewCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ProjectViewCtrl', function ($scope, $stateParams, ProjectsService) {
    $scope.fabOpen = false; // TODO this doesn't seem to have an effect, #6788 in md github
    if ( $scope.isLoggedIn() ) {
      ProjectsService.get({id: $stateParams.id}, function(result) {
        $scope.project = result.data;

      }, function(err) {
        $log.debug('ERROR getting project', err);
      });
    }
  });

'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ResourcesPanelCtrl
 * @description
 * # ResourcesPanelCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ResourcesPanelCtrl', function ($scope, $window, appConfig, ProjectsService) {
    $scope.getResourceUrl = function(resource) {
      if ( resource.url ) {
        return resource.url;
      } else if ( resource.file ) {
        return ProjectsService.generateResourceDownloadUrl(resource._id);
      }
    };

    $scope.openResource = function(ev, resource) {
      if ( resource.url ) {
        $window.open(resource.url, '_blank');
      } else if ( resource.file ) {
        $window.open( $scope.getResourceUrl(resource) + '?dl', '_blank');
      }
    };

    $scope.getResourceOpenIcon = function(resource) {
      return ( resource && resource.file )  ? 'file_download' : 'open_in_new';
    };

    $scope.getIcon = function(resource) {
      return ProjectsService.getResourceIcon(resource);
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ResourcesPanelCtrl
 * @description
 * # ResourcesPanelCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ResourcesPanelCtrl', function ($scope, $window, appConfig) {
    $scope.openResource = function(ev, resource) {
      if ( resource.url ) {
        $window.open(resource.url, '_blank');
      } else if ( resource.file ) {
        $window.open( appConfig.backendUrl + '/download/resources/' + resource._id, '_blank');
      }
    };

    $scope.getResourceOpenIcon = function(resource) {
      return ( resource && resource.file )  ? 'file_download' : 'open_in_new';
    };

    $scope.getIcon = function(resource) {
      var icon = 'mdi-help';

      if ( resource.url ) {
        icon = 'mdi-web';
      } else if ( resource.file ) {
        switch(resource.file.type) {
          case 'image/jpeg':
          case 'image/jpg':
          case 'image/png':
          case 'image/gif':
          case 'image/tiff':
            icon = 'mdi-file-image';
            break;
          case 'application/pdf':
            icon = 'mdi-file-pdf';
            break;
          default:
            icon = 'mdi-file';
        }
      }

      return icon;
    };
  });

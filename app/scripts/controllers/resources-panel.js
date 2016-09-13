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
          // file-check, file-cloud,
          // file-export, file-find, file-hidden, file-import, file-lock,
          // file-multiple, file-outline, file-restore,
          // file-send, file-tree, file-xml
          case 'image/jpeg':
          case 'image/png':
          case 'image/gif':
          case 'image/tiff':
          case 'image/bmp':
          case 'image/x-icon':
          case 'image/svg+xml':
            icon = 'mdi-file-image';
            break;
          case 'application/pdf':
            icon = 'mdi-file-pdf';
            break;
          /*case '':
            icon = 'mdi-file-chart';
            break;*/
          case 'text/csv':
          case 'text/tab-separated-values':
            icon = 'mdi-file-delimited';
            break;
          case 'application/x-abiword':
          case 'text/plain':
            icon = 'mdi-file-document';
            break;
          case 'application/vnd.ms-excel':
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            icon = 'mdi-file-excel';
            break;
          case 'application/vnd.ms-powerpoint':
          case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            icon = 'mdi-file-powerpoint';
            break;
          case 'application/msword':
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            icon = 'mdi-file-word';
            break;
          case 'application/ogg':
          case 'audio/mp3':
          case 'audio/midi':
          case 'audio/x-m4a':
          case 'audio/amr':
          case 'audio/mpeg':
          case 'audio/wav':
          case 'audio/x-ms-wma':
          case 'audio/x-ms-wmv':
          case 'audio/webm':
          case 'audio/x-aac':
          case 'audio/x-aiff':
          case 'audio/mp4':
            icon = 'mdi-file-music';
            break;
          case 'video/avi':
          case 'video/mpeg':
          case 'video/quicktime':
          case 'video/webm':
          case 'video/x-msvideo':
          case 'video/x-flv':
          case 'video/mp4':
            icon = 'mdi-file-video';
            break;
          default:
            icon = 'mdi-file';
        }
      }

      return icon;
    };
  });

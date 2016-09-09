'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:tlFileUpload
 * @description
 * # tlFileUpload
 */
angular.module('timelinerApp')
  .directive('tlFileUpload', function () {
    var template = '<div layout="row">' +
      '<input aria-label="file" ng-disabled="isDisabled()" type="file" ng-hide="true">' +
      '<span style="position:absolute">{{ getFileName() }}</span>' +
      '<span flex></span>' +
      '<md-button class="md-icon-button" aria-label="Remove file" type="button" ng-click="removeFileForUpload($event)" ng-show="hasFile()" ng-disabled="isDisabled()"><md-icon>delete</md-icon></md-button>' +
      '<md-button class="md-icon-button" aria-label="Select file for upload" type="button" ng-click="selectFileForUpload($event)" ng-disabled="isDisabled()"><md-icon>file_upload</md-icon></md-button>' +
      '</div>';

    return {
      template: template,
      scope: {
        data: '='
      },
      link: function postLink(scope, element, attrs) {
        var fileElement = element.find('input')[0];

        scope.isDisabled = function() {
          return attrs.disabled;
        };

        scope.selectFileForUpload = function(ev) {
            fileElement.click();
            angular.element(ev.target).parent().blur();
        };

        scope.hasFile = function() {
          return !!scope.data;
        };

        scope.removeFileForUpload = function() {
          if ( scope.hasFile() ) {
            scope.data = null;
            fileElement.value = null;
          }
        };

        scope.getFileName = function() {
          if ( scope.data && scope.data.name ) {
            return scope.data.name;
          }

          return '';
        };

        element.addClass('md-input');

        element.on('change', function() {
          if ( fileElement.files.length > 0 ) {
            scope.data = fileElement.files[0];
            scope.$apply();
          }
        });

        scope.$on('$destroy', function() {
          element.off('change');
        });
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:tlFileUpload
 * @description
 * # tlFileUpload
 */
angular.module('timelinerApp')
  .directive('tlFileUpload', function ($sanitize) {
    return {
      template: '<input aria-label="file" ng-disabled="isDisabled()" type="file">',
      scope: {
        data: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.isDisabled = function() {
          return attrs.disabled;
        };

        if ( scope.data ) {
          element.append('<span style="position:absolute;right:5px;top:25px;">' + $sanitize(scope.data.name) + '</span>');
        }

        element.on('change', function() {
          var fileElement = element.find('input')[0];
          if ( fileElement.files.length > 0 ) {
            scope.data = fileElement.files[0];
            fileElement.blur();
          }
        });

        scope.$on('$destroy', function() {
          element.off('change');
        });
      }
    };
  });

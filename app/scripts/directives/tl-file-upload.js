'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:tlFileUpload
 * @description
 * # tlFileUpload
 */
angular.module('timelinerApp')
  .directive('tlFileUpload', function ($sanitize) {
    function displayModelFileName(element, name) {
      element.append('<span style="position:absolute;right:5px;top:25px;">' + $sanitize(name) + '</span>');
    }

    function removeModelFileName(element) {
      element.find('span').remove();
    }

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
          displayModelFileName(element, scope.data.name);
        }

        element.on('change', function() {
          var fileElement = element.find('input')[0];
          if ( fileElement.files.length > 0 ) {
            removeModelFileName(element);
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

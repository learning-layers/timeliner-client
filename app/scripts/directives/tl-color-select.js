'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:tlColorSelect
 * @description
 * # tlColorSelect
 */
angular.module('timelinerApp')
  .directive('tlColorSelect', function () {
    return {
      templateUrl: 'views/templates/tl-color-select.html',
      restrict: 'E',
      scope: {
        color: '='
      },
      link: function postLink(scope, element) {
        scope.colors = [1, 2, 3, 4, 5, 6];

        scope.isCurrentColor = function(color) {
          return color === scope.color;
        };

        scope.setCurrentColor = function(color) {
          scope.color = color;
        };

        if ( element.parent().find('label') ) {
          var colorSelectElement = angular.element(element[0].firstChild);
          colorSelectElement.attr('class', colorSelectElement.attr('class') + ' tl-color-select-fix-title');
        }
      }
    };
  });

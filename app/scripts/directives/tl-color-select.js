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
      link: function postLink(scope) {
        scope.colors = [1, 2, 3, 4, 5, 6];

        scope.isCurrentColor = function(color) {
          return color === scope.color;
        };

        scope.setCurrentColor = function(color) {
          scope.color = color;
        };
      }
    };
  });
